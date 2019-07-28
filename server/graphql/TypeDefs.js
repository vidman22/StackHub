const { buildSchema } = require('graphql');

const schema = buildSchema(`

    type Query {
        user(id: Int) : User
    }

    type User{
        id: Int
		email: String
		username: String
		password: String
    }

    type Mutation {
        signup( username: String , email: String, password: String ) : User
        login( email: String!, password: String! ) : User
    }
`);

module.exports = schema;