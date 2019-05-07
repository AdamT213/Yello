const next = require("next");
const express = require("express");
const graphqlHTTP = require("express-graphql");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const schema = require("./graphql/schema");

require("dotenv").config();

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;
const MONGO_URL = dev ? process.env.MONGO_URL_TEST : process.env.MONGO_URL;
const app = next({ dev });
const handle = app.getRequestHandler();

const customFormatErrorFn = error => ({
  message: error.message,
  locations: error.locations,
  stack: error.stack ? error.stack.split("\n") : [],
  path: error.path
});

app.prepare().then(async () => {
  try {
    const client = await MongoClient.connect(MONGO_URL, {
      useNewUrlParser: true
    });

    const db = client.db(process.env.dbName);
    const Boards = db.collection("boards");
    const Lists = db.collection("lists");
    const Cards = db.collection("cards");

    const resolvers = {
      board: async args => Boards.findOne(args),
      boards: async () => Boards.find({}).toArray(),
      list: async args => Lists.findOne(args),
      lists: async () => Lists.find({}).toArray(),
      card: async args => Cards.findOne(args),
      cards: async () => Cards.find({}).toArray(),
      createBoard: async args => {
        const board = await Boards.insertOne(args);
        return board.ops[0];
      },
      createList: async args => {
        const list = await Lists.insertOne(args);
        return list.ops[0];
      },
      createCard: async args => {
        const card = await Cards.insertOne(args);
        return card.ops[0];
      },
      createUser: async args => {
        args.password = bcrypt.hashSync(args.password, 10);
        const res = await db.collection("users").insertOne(args);
        return res.ops[0];
      },
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
      },
      addBoardToUser: async args => {
        const res = await db
          .collection("users")
          .updateOne(
            { _id: args.user_id },
            { $set: { boards: [{ _id: args._id }] } }
          );
        return res.modifiedCount;
      },
      addMemberToBoard: async args => {
        const res = await db
          .collection("boards")
          .updateOne(
            { _id: args.board_id },
            { $push: { members: { _id: args._id } } }
          );
        return res.modifiedCount;
      },
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
      },
      removeCardFromList: async args => {
        const res = await db.collection("boards").updateOne(
          {
            _id: args.board_id,
            "lists._id": args.list_id
          },
          { $pull: { "lists.$.cards": { _id: args._id } } }
        );
        return res.modifiedCount;
      },
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
      },
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
    exports.resolvers = resolvers;

    const server = express();
    server.use(
      "/graphql",
      cors(),
      bodyParser.json(),
      graphqlHTTP({
        schema,
        rootValue: resolvers,
        graphiql: dev,
        customFormatErrorFn
      })
    );

    server.get("/", (req, res) => {
      handle(req, res);
    });

    server.listen(port, err => {
      if (err) throw err;
      console.log(`listening on port ${port}`);
    });
  } catch (err) {
    console.error(err);
  }
});
