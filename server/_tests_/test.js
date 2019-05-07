const { graphql } = require("graphql");
const { MongoClient } = require("mongodb");
const { schema } = require("../graphql/schema");
const { boards } = require("./data");
const bcrypt = require("bcrypt");

let connection;
let db;

beforeAll(async () => {
  connection = await MongoClient.connect(global.MONGO_URI, {
    useNewUrlParser: true
  });
  db = await connection.db(global.MONGO_DB_NAME);
  const collection = db.collection("boards");
  await collection.insertMany(boards, err => {
    if (err) {
      console.log(err);
    } else {
      console.log("Documents inserted!");
    }
  });
});

afterAll(async () => {
  await connection.close();
});

it("saves records to the mongo datastore", async () => {
  const inserted = await db
    .collection("boards")
    .find({})
    .toArray();
  const count = await db.collection("boards").count();
  expect(count).toBe(boards.length);
  expect(inserted).toEqual(boards);
});

it("queries for records using a graphql query", async () => {
  const query = `
    query Q {
      boards {
          _id
          title
          members {
            name
            email
          }
          lists {
            _id
            cards {
              title
            }
          }
          deadline
      }
    }
  `;
  const rootValue = {
    boards: async () =>
      db
        .collection("boards")
        .find({})
        .toArray()
  };

  const result = await graphql(schema, query, rootValue);
  const { data } = result;
  expect(data.boards.length).toBe(boards.length);
  for (let i = 0; i < data.boards.length; i++) {
    expect(data.boards[i].title).toEqual(boards[i].title);
  }
});

it("creates a user using a graphql mutation", async () => {
  const query = `
  mutation M {
    createUser(_id: 49628, name: "Andre the Giant", email: "andre@thegiant.com", password: "IAmAGiant") {
        _id
        name
        email
        password
    }
  }
`;
  const rootValue = {
    createUser: async args => {
      args.password = bcrypt.hashSync(args.password, 10);
      const res = await db.collection("users").insertOne(args);
      return res.ops[0];
    }
  };

  const result = await graphql(schema, query, rootValue);
  const { data } = result;
  expect(data.createUser.name).toBe("Andre the Giant");
  expect(data.createUser.email).toBe("andre@thegiant.com");
  expect(bcrypt.compareSync("IAmAGiant", data.createUser.password)).toBe(true);
});

it("can add a list to a board", async () => {
  const query = `
  mutation M {
    addListToBoard(board_id: 91191, _id: 12101, title: "Things to do") 
  }
`;
  const rootValue = {
    addListToBoard: async args => {
      try {
        const res = await db
          .collection("boards")
          .updateOne(
            { _id: args.board_id },
            { $push: { lists: { _id: args._id, title: args.title } } }
          );
        return res.modifiedCount;
      } catch (e) {
        console.error(e);
      }
    }
  };
  const result = await graphql(schema, query, rootValue);
  const { data } = result;
  expect(data.addListToBoard).toBe(1);
  const updated = await db.collection("boards").findOne({ _id: "91191" });
  expect(updated.lists.length).toBe(1);
  expect(updated.lists[0].title).toBe("Things to do");
});

it("can add a board to a user and a user to a board", async () => {
  const query = `
  mutation M {
    addBoardToUser(user_id: 49628, _id: 91191)
  }
`;
  const secondQuery = ` 
  mutation N {
    addMemberToBoard(board_id: 91191, _id: 49628)
  }
  `;
  let rootValue = {
    addBoardToUser: async args => {
      const res = await db
        .collection("users")
        .updateOne(
          { _id: args.user_id },
          { $set: { boards: [{ _id: args._id }] } }
        );
      return res.modifiedCount;
    }
  };
  await graphql(schema, query, rootValue);
  rootValue = {
    addMemberToBoard: async args => {
      const res = await db
        .collection("boards")
        .updateOne(
          { _id: args.board_id },
          { $push: { members: { _id: args._id } } }
        );
      return res.modifiedCount;
    }
  };
  await graphql(schema, secondQuery, rootValue);
  const updatedBoard = await db.collection("boards").findOne({ _id: "91191" });
  const updatedUser = await db.collection("users").findOne({ _id: "49628" });
  expect(updatedBoard.members[0]._id).toBe(updatedUser._id);
  expect(updatedUser.boards[0]._id).toBe(updatedBoard._id);
});

it("can add a card to a list, and change the list a card belongs to", async () => {
  // add new card to db
  await db.collection("cards").insertOne({
    _id: "51617",
    deadline: new Date("May 20 , 2020 03:28:00"),
    title: "Eat Potatoes"
  });
  // add new list to board in db
  await db
    .collection("boards")
    .updateOne(
      { _id: "91191" },
      { $push: { lists: { _id: "61718", title: "Doing" } } }
    );
  // add newly created card as reference to first list in board
  let query = `
  mutation M {
    addCardToList(board_id: 91191, list_id: 12101, _id: 51617)
  }
`;
  let rootValue = {
    addCardToList: async args => {
      try {
        const res = await db.collection("boards").updateOne(
          { _id: args.board_id, "lists._id": args.list_id },
          {
            $push: {
              "lists.$.cards": {
                _id: args._id
              }
            }
          }
        );
        return res.modifiedCount;
      } catch (e) {
        console.error(e);
      }
    }
  };
  let result = await graphql(schema, query, rootValue);
  console.log(result);
  let { data } = result;
  expect(data.addCardToList).toBe(1);
  let board = await db.collection("boards").findOne({ _id: "91191" });
  let list = board.lists[0];
  let card = await db.collection("cards").findOne({ _id: "51617" });
  expect(list.cards[0]._id).toBe(card._id);
  // expect(card.list_id).toBe(list._id);
  // change the list that card belongs to by first changing reference on card
  //   query = `
  //   mutation N {
  //     addListToCard(list_id: 61718, _id: 51617)
  //   }
  // `;
  //   rootValue = {
  //     addListToCard: async args => {
  //       const res = await db
  //         .collection("cards")
  //         .updateOne({ _id: args._id }, { $set: { list_id: args.list_id } });
  //       return res.modifiedCount;
  //     }
  //   };
  //   result = await graphql(schema, query, rootValue);
  //   ({ data } = result);
  //   expect(data.addListToCard).toBe(1);
  //   let updated = await db.collection("cards").findOne({ _id: "51617" });
  //   expect(updated.list_id).toBe("61718");
  // then remove the reference to the card on the old list
  query = `
  mutation O {
    removeCardFromList(board_id: 91191, list_id: 12101 , _id: 51617)
  }
`;
  rootValue = {
    removeCardFromList: async args => {
      const res = await db.collection("boards").updateOne(
        {
          _id: args.board_id,
          "lists._id": args.list_id
        },
        { $pull: { "lists.$.cards": { _id: args._id } } }
      );
      return res.modifiedCount;
    }
  };
  result = await graphql(schema, query, rootValue);
  ({ data } = result);
  expect(data.removeCardFromList).toBe(1);
  const updated = await db.collection("boards").findOne({ _id: "91191" });
  console.log(updated.lists[0]);
  expect(updated.lists[0].cards[0]).toBe(undefined);
  // and finally add the reference to the card to the new list
  query = `
  mutation Q {
    addCardToList(board_id: 91191, list_id: 61718, _id: 51617)
  }
`;
  rootValue = {
    addCardToList: async args => {
      try {
        const res = await db.collection("boards").updateOne(
          { _id: args.board_id, "lists._id": args.list_id },
          {
            $push: {
              "lists.$.cards": {
                _id: args._id
              }
            }
          }
        );
        return res.modifiedCount;
      } catch (e) {
        console.error(e);
      }
    }
  };
  result = await graphql(schema, query, rootValue);
  ({ data } = result);
  expect(data.addCardToList).toBe(1);
  board = await db.collection("boards").findOne({ _id: "91191" });
  list = board.lists[1];
  card = await db.collection("cards").findOne({ _id: "51617" });
  expect(list.cards[0]._id).toBe(card._id);
  // expect(card.list_id).toBe(list._id);
});

it("can add a checklist to a card, and toggle the status of a list item", async () => {
  let query = `
  mutation M {
    addListItemToCard(card_id: 51617, _id: 21221, description: "make potatoes", status: false)
  }
`;
  let rootValue = {
    addListItemToCard: async args => {
      try {
        const res = await db.collection("cards").updateOne(
          { _id: args.card_id },
          {
            $push: {
              checklist: {
                _id: args._id,
                description: args.description,
                status: args.status
              }
            }
          }
        );
        return res.modifiedCount;
      } catch (e) {
        console.error(e);
      }
    }
  };
  let result = await graphql(schema, query, rootValue);
  let { data } = result;
  expect(data.addListItemToCard).toBe(1);
  const card = await db.collection("cards").findOne({ _id: "51617" });
  expect(card.checklist[0].description).toBe("make potatoes");
  expect(card.checklist[0].status).toBe(false);

  query = `
  mutation M {
    markListItemComplete(card_id: 51617, _id: 21221)
  }
`;
  rootValue = {
    markListItemComplete: async args => {
      try {
        const res = await db
          .collection("cards")
          .updateOne(
            { _id: args.card_id },
            { $set: { "checklist.0": [{ status: true }] } }
          );
        return res.modifiedCount;
      } catch (e) {
        console.error(e);
      }
    }
  };
  result = await graphql(schema, query, rootValue);
  ({ data } = result);
  expect(data.markListItemComplete).toBe(1);
  expect(card.checklist[0].status).toBe(false);
});
