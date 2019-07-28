const { buildSchema } = require('graphql');

const schema = buildSchema(`

    type Query {
        user(id: Int) : User
    }

    type User{
        id: Int!
		email: String!
		password: String!
    }
    type AuthPayload {
        token: String
        expiresIn: Int
        user: User
  }

    type Mutation {
        signUp( email: String!, password: String! ) : AuthPayload
        login( email: String!, password: String! ) : AuthPayload
    }
`);

module.exports = schema;