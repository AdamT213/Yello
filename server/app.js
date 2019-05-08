const next = require("next");
const express = require("express");
const jwt = require("express-jwt");
const graphqlHTTP = require("express-graphql");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
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
    const Cards = db.collection("cards");
    const Users = db.collection("users");

    const resolvers = {
      board: async args => Boards.findOne(args),
      boards: async () => Boards.find({}).toArray(),
      card: async args => Cards.findOne(args),
      cards: async () => Cards.find({}).toArray(),
      createBoard: async args => {
        const board = await Boards.insertOne(args);
        return board.ops[0];
      },
      createCard: async args => {
        const card = await Cards.insertOne(args);
        return card.ops[0];
      },
      signup: async ({ name, email, password }) => {
        console.log(name);
        const user = await Users.insertOne({
          name,
          email,
          password: await bcrypt.hash(password, 10)
        });
        // return json web token
        return jsonwebtoken.sign(
          { _id: user._id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "1y" }
        );
      },
      login: async ({ email, password }) => {
        console.log(email);
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
          { $set: { boards: [{ _id: args._id }] } }
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
          const res = await Cards.updateOne(
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
          const res = await Cards.updateOne(
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
      jwt({
        secret: process.env.JWT_SECRET,
        credentialsRequired: false
      }).unless({ path: ["/login", "/signup", "/graphql"] })
    );

    server.use((err, req, res, next) => {
      if (err.name === "UnauthorizedError") {
        return res.redirect("/login");
      }
      next();
    });

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

    server.get("*", (req, res) => {
      handle(req, res);
    });

    server.get("/user/:slug", (req, res) => {
      return app.render(req, res, "/user", { slug: req.params.slug });
    });

    server.listen(port, err => {
      if (err) throw err;
      console.log(`listening on port ${port}`);
    });
  } catch (err) {
    console.error(err);
  }
});
