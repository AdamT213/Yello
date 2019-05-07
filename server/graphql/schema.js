const { buildSchema } = require("graphql");
const {
  GraphQLDate,
  GraphQLTime,
  GraphQLDateTime
} = require("graphql-iso-date");

exports.schema = buildSchema(`
      scalar GraphQLDate
      type Query {
        board(_id: ID): Board!
        boards: [Board!]!
        list(_id: ID): List!
        lists: [List]!
        card(_id: ID): Card!
        cards: [Card]!
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
        cards: [Card!]!
      }
      type Card  {
        deadLine: GraphQLDate
        List_id: ID!
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
        createBoard(_id: ID, project_id: ID): Board!
        createList(_id: ID, board_id: ID): List!
        createCard(_id: ID, list_id: ID): Card!
        createUser(_id: ID, name: String!, email: String!, password: String!): User!
        addListToBoard(board_id: ID!, _id: ID!, title: String!): Int!
        addBoardToUser(user_id: ID!, _id: ID): Int!
        addMemberToBoard(board_id: ID!, _id: ID): Int!
        addCardToList(board_id: ID, list_id: ID!, _id: ID!): Int!
        removeCardFromList(board_id: ID!, list_id: ID!, _id: ID!): Int!
        addListItemToCard(card_id: ID!, _id: ID!, description: String!, status: Boolean!): Int!
        markListItemComplete(card_id: ID!, _id: ID): Int!
      }
`);
// addListToCard(list_id: ID!, _id: ID): Int!
