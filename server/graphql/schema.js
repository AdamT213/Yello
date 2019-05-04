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
        boards: [Board]!
        list(_id: ID): List!
        lists: [List]!
        card(_id: ID): Card!
        cards: [Card]!
      }
      type Board {
        _id: ID!
        title: String
        members: [User!]!
        lists: [List!]!
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
        name: String! 
        email: String! 
        password_digest: String!
      }
      type Mutation {
        createBoard(_id: ID, project_id: ID): Board!
        createList(_id: ID, board_id: ID): List!
        createCard(_id: ID, list_id: ID): Card!
      }
`);
