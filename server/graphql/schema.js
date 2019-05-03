const { buildSchema } = require("graphql");

exports.schema = buildSchema(`
      type Query {
        project(_id: ID): Project!
        projects: [Project]!
        board(_id: ID): Board!
        boards: [Board]!
        list(_id: ID) List!
        lists: [List]!
        card(_id: ID): Card!
        cards: [Card]!
      }
      type Project {
        _id: ID!
        members: [User]!
        deadline: Date
        boards: [Board!]!
      }
      type Board {
        _id: ID!
        lists: [List!]!
      }
      type List { 
        _id: ID!
        cards: [Card!]!
      }
      type Card  {
      }
      type Mutation {
        createProject(_id: ID, deadline: Date): Project!
        createBoard(_id: ID, project_id: ID): Board!
        createList(_id: ID, board_id: ID): List!
        createCard(_id: ID, list_id: ID): Card!
      }
`);
