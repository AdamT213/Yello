const next = require("next");
const express = require("express");
const jwt = require("express-jwt");
const graphqlHTTP = require("express-graphql");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const schema = require("./graphql/schema");
const { ObjectId } = require("mongodb");

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
    const Users = db.collection("users");

    const resolvers = {
      board: async args => {
        try {
          const board = await Boards.findOne(args);
          console.log(board);
          return board;
        } catch (e) {
          throw new Error(e);
        }
      },
      boards: async (args, context) => {
        try {
          return Boards.find({
            "members._id": args.user_id
          }).toArray();
        } catch (e) {
          throw new Error(e);
        }
      },
      createBoard: async args => {
        try {
          let board = await Boards.insertOne({
            _id: args._id,
            title: args.title,
            deadline: args.deadline
          });
          let found = await Users.find({}).toArray();
          console.log(`found: ${found}`);
          let user = await Users.updateOne(
            { _id: ObjectId(args.user_id) },
            { $push: { boards: { _id: args._id } } }
          );
          console.log(`user: ${user}`);
          let updated = await Boards.updateOne(
            { _id: args._id },
            { $push: { members: { _id: args.user_id } } }
          );
          const res = await Boards.findOne({ _id: args._id });
          return res;
        } catch (e) {
          throw new Error(e);
        }
      },
      addCardToBoard: async args => {
        let updated = await Boards.updateOne(
          { _id: args.board_id },
          {
            $push: {
              cards: {
                _id: args._id,
                title: args.title,
                list_id: args.list_id,
                board_id: args.board_id
              }
            }
          }
        );
        return updated.modifiedCount;
      },
      me: async (args, context) => {
        try {
          return await Users.findOne({ email: context.user.email });
        } catch (e) {
          throw new Error("Not authenticated");
        }
      },
      signup: async ({ name, email, password }) => {
        const user = await Users.insertOne({
          name,
          email,
          password: await bcrypt.hash(password, 10)
        });
        const info = user.ops[0];
        // return json web token
        return jsonwebtoken.sign(
          { _id: info._id, email: info.email },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );
      },
      login: async ({ email, password }) => {
        const user = await Users.findOne({ email: email });
        if (!user) {
          throw new Error("No user with that email");
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
          throw new Error("Incorrect password");
        }
        // return json web token
        return jsonwebtoken.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );
      },
      addListToBoard: async args => {
        try {
          const res = await Boards.updateOne(
            { _id: args.board_id },
            { $push: { lists: { _id: args._id, title: args.title } } }
          );
          return res.modifiedCount;
        } catch (e) {
          console.error(e);
        }
      },
      addBoardToUser: async args => {
        const res = await Users.updateOne(
          { _id: args.user_id },
          { $push: { boards: { _id: args._id } } }
        );
        return res.modifiedCount;
      },
      addMemberToBoard: async args => {
        const res = await Boards.updateOne(
          { _id: args.board_id },
          { $push: { members: { _id: args._id } } }
        );
        return res.modifiedCount;
      },
      addCardToList: async args => {
        try {
          const res = await Boards.updateOne(
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
        const res = await Boards.updateOne(
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
          console.log(args.board_id);
          const res = await Boards.updateOne(
            { _id: args.board_id, "cards._id": args.card_id },
            {
              $push: {
                "cards.$.checklist": {
                  card_id: args.card_id,
                  board_id: args.board_id,
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
          const res = await Boards.updateOne(
            { _id: args.board_id },
            {
              $set: {
                "cards.$[i].checklist.$[j].status": true
              }
            },
            {
              arrayFilters: [
                {
                  "i._id": args.card_id
                },
                {
                  "j._id": args._id
                }
              ]
            }
          );
          return res.modifiedCount;
        } catch (e) {
          console.error(e);
        }
      }
    };
    exports.resolvers = resolvers;

    const server = express();

    const auth = jwt({
      secret: process.env.JWT_SECRET,
      credentialsRequired: false,
      getToken: function fromCookie(context) {
        if (context.cookies["id_token"]) {
          return context.cookies["id_token"];
        }
        return null;
      }
    });

    const corsOptions = {
      origin: "http://localhost:3000",
      credentials: true
    };

    server.use(cookieParser());
    server.use(bodyParser.json());

    server.use(
      "/graphql",
      auth,
      cors(corsOptions),
      graphqlHTTP({
        schema,
        rootValue: resolvers,
        graphiql: dev,
        customFormatErrorFn
      })
    );

    server.get("*", (req, res) => {
      handle(req, res);
    });

    server.get("/user/:email", (req, res) => {
      return app.render(req, res, "/user", { email: req.params.email });
    });

    server.get("/board/:id", (req, res) => {
      return app.render(req, res, "/board", { id: req.params.id });
    });

    server.listen(port, err => {
      if (err) throw err;
      console.log(`listening on port ${port}`);
    });
  } catch (err) {
    console.error(err);
  }
});
