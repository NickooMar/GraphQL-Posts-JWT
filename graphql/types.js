const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = require("graphql");
const { User, Post, Comment } = require("../models");

const UserType = new GraphQLObjectType({
  name: "UserType",
  description: "The user type",
  fields: {
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    displayName: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  },
});

const PostType = new GraphQLObjectType({
  name: "PostType",
  description: "The post type",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    body: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    author: {
      type: UserType,
      resolve(parent) {
        //Parent vendria a ser el post, y sus datos.
        return User.findById(parent.authorId);
      },
    },
    comments: {
      type: new GraphQLList(CommentType),
      resolve(parent) {
        return Comment.find({ postId: parent.id }); //Traigo todos los comentarios que coincidan con la publicación
      }
    }
  }),
});

const CommentType = new GraphQLObjectType({
  name: "CommentType",
  description: "This is a comment Type",
  fields: {
    id: { type: GraphQLID },
    comment: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent) {
        return User.findById(parent.userId);
      },
    }, //El usuario tiene un tipo de dato anteriormente creado, que es UserType
    post: {
      type: PostType,
      resolve(parent) {
        return Post.findById(parent.postId);
      },
    },
  },
});

module.exports = { UserType, PostType, CommentType };
