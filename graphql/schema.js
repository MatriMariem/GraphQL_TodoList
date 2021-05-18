const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Task {
    _id: ID!
    content: String!
    createdBy: User!
    sharedWith: [User]
    done: Boolean!
    comments: [Comment!]
}

type User {
  _id: ID!
  email: String!
  username: String!
  password: String
  tasks: [Task!]
  sharedTasks: [Task!]
  comments: [Comment!]
}

type Auth {
  userId: ID!
  token: String!
}

type Comment {
  _id: ID!
  content: String!
  createdBy: User!
  createdIn: Task!
}

type Query {
  users: [User!]!
  tasks(userId: ID!): [Task!]!
  comments(taskId: ID!): [Comment!]!
  login(email: String!, password: String!): Auth
  logout: String
}
type Mutation {
    signUp(username: String!, email: String!, password: String!): User
    addTask(taskContent: String!): Task
    shareTask(userId: ID!, taskId: ID!): Task
    editTask(taskId: ID!): Task
    commentTask(taskId: ID!, commentContent: String!): Task
    doneTask(taskId: ID!): Task
    deleteTask(taskId: ID!): Task
}
schema {
    query: Query
    mutation: Mutation
}
`);
