const { graphql } = require("graphql");
const { MongoClient } = require("mongodb");
const { schema } = require("../graphql/schema");
const { boards, lists, cards } = require("./data");

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
  console.log(inserted);
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
  console.log(data);
  expect(data.boards.length).toBe(boards.length);
  for (let i = 0; i < data.boards.length; i++) {
    expect(data.boards[i].title).toEqual(boards[i].title);
  }
});

it("creates a User using a graphql mutation", async () => {
  const query = `
  mutation M {
    createUser(_id: 49628, name: "Andre the Giant", email: "andre@thegiant.com, password: "IAmAGiant") {
        _id
        name
        password_digest
    }
  }
`;
  const rootValue = {
    createUser: async () => db.collection("users")
    // ***stuff to come***
  };

  const result = await graphql(schema, query, rootValue);
  const { data } = result;
});

it("can add a list to a board", async () => {
  // ***stuff to come***
});

it("can add a user to a board and a board to a user", async () => {
  // ***stuff to come***
});

it("can add a card to a list, and change the list a card belongs to", async () => {
  // ***stuff to come***
});

it("can add a checklist to a card, and toggle the status of a list item", async () => {
  // ***stuff to come***
});
