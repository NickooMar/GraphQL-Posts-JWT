const { GraphQLList, GraphQLString, GraphQLID } = require("graphql");
const { UserType, PostType } = require("./types");

const { User, Post } = require("../models");

const users = {
  type: new GraphQLList(UserType),
  resolve() {
    return User.find();
  },
};

const user = {
  type: UserType,
  description: "Get a user by id",
  args: {
    //Args me dice que se le tiene que pasar un id a la funcion
    id: { type: GraphQLID },
  },
  resolve(_, args) {
    return User.findById(args.id);
  },
};

const posts = {
  type: new GraphQLList(PostType),
  description: "Get all posts",
  resolve: () => Post.find(),
};

const post = {
  type: PostType,
  description: "Get a post by id",
  args: {
    id: { type: GraphQLID },
  },
  resolve: (_, { id }) => Post.findById(id),
};

module.exports = { users, user, posts, post };
