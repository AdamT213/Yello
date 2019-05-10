const { buildSchema } = require("graphql");
const {
  GraphQLDate,
  GraphQLTime,
  GraphQLDateTime
} = require("graphql-iso-date");

const schema = buildSchema(`
      scalar GraphQLDate
      type Query {
        board(_id: ID): Board!
        boards(user_id: ID): [Board!]!
        card(_id: ID): Card!
        cards: [Card]!
        me: User
      }
      type Board {
        _id: ID!
        title: String!
        members: [User!]
        lists: [List!]
        deadline: GraphQLDate
      }
      type List {
        _id: ID!
        title: String!
        cards: [Card!]!
      }
      type Card  {
        deadLine: GraphQLDate
        title: String!
        comments: [String!]!
        checklist: [listItem!]!
      }
      type listItem {
        description: String! 
        status: Boolean!
      }
      type User { 
        _id: ID!
        name: String!
        email: String!
        password: String!
      }
      type Mutation {
        createBoard(_id: ID, user_id: ID, title: String!, deadline: GraphQLDate): Board!
        createCard(_id: ID, list_id: ID): Card!
        signup(id:ID,name: String!, email: String!, password: String!): String
        login(email: String!, password: String!): String
        addListToBoard(board_id: ID!, _id: ID!, title: String!): Int!
        addBoardToUser(user_id: ID!, _id: ID): Int!
        addMemberToBoard(board_id: ID!, _id: ID): Int!
        addCardToList(board_id: ID, list_id: ID!, _id: ID!): Int!
        removeCardFromList(board_id: ID!, list_id: ID!, _id: ID!): Int!
        addListItemToCard(card_id: ID!, _id: ID!, description: String!, status: Boolean!): Int!
        markListItemComplete(card_id: ID!, _id: ID): Int!
      }
`);

module.exports = schema;
