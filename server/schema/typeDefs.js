const typeDefs = `
type Book {
    _id: ID!
    author: String
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
}

type User {
    _id: ID!
    username: String!
    email: String!
    savedBooks: [Book]
    bookCount: Int
}

type Query {
    getAllBooks: [Book]
    getBooksByTitle(title: String!): [Book]
}

type Mutation {
    saveBook(bookId: String!, author: String!, description: String!, image: String, link: String, title: String!): User
    removeBook(bookId: String!): User
}
`

module.exports = typeDefs;