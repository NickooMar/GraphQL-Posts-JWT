const { GraphQLString, GraphQLID } = require("graphql");
const { User, Post, Comment } = require("../models");

const { PostType, commentType } = require("./types");

const { createJWTToken } = require("../util/auth");

const register = {
  type: GraphQLString,
  description: "Register a new User and returns a token",
  args: {
    username: { type: GraphQLString },
    password: { type: GraphQLString },
    email: { type: GraphQLString },
    displayName: { type: GraphQLString },
  },
  async resolve(_, args) {
    const { username, password, email, displayName } = args;

    const user = new User({ username, password, email, displayName });
    await user.save();

    const token = createJWTToken({
      _id: user._id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
    });

    return token, "New user created";
  },
};

const login = {
  type: GraphQLString,
  description: "Login a user and returns a token",
  args: {
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  async resolve(_, args) {
    const user = await User.findOne({ email: args.email }).select("+password");

    if (!user || args.password !== user.password)
      throw new Error("Invalid Credentials");

    const token = createJWTToken({
      _id: user._id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
    });

    return token;
  },
};

const createPost = {
  type: PostType,
  description: "Create a new post",
  args: {
    title: { type: GraphQLString },
    body: { type: GraphQLString },
  },
  async resolve(_, args, { verifiedUser }) {
    const post = new Post({
      title: args.title,
      body: args.body,
      authorId: verifiedUser._id,
    });

    await post.save();

    return post;
  },
};

const updatePost = {
  type: PostType,
  description: "Update a post",
  args: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    body: { type: GraphQLString },
  },
  async resolve(_, { id, title, body }, { verifiedUser }) {
    if (!verifiedUser) throw new Error("Unauthorized");
    const updatedPost = await Post.findByIdAndUpdate(
      { _id: id, authorId: verifiedUser._id },
      { title, body },
      { new: true, runValidators: true } //New: true me devuelve el nuevo post, runValidators: true me ejecuta las validaciones
    );
    return updatedPost;
  },
};

const deletePost = {
  type: GraphQLString,
  description: "Delete a post",
  args: {
    postId: { type: GraphQLID },
  },
  async resolve(_, { postId }, { verifiedUser }) {
    if (!verifiedUser) throw new Error("Unauthorized");
    const postDeleted = await Post.findByIdAndDelete({
      _id: postId,
      authorId: verifiedUser._id,
    });

    if (!postDeleted) throw new Error("Post not found");

    return "Post Successfully deleted";
  },
};

const addComment = {
  type: commentType,
  description: "Add a comment to a post",
  args: {
    comment: { type: GraphQLString },
    postId: { type: GraphQLID },
  },
  async resolve(_, { comment, postId }, { verifiedUser }) {
    if (!verifiedUser) throw new Error("Unauthorized");

    const newComment = new Comment({
      comment,
      postId,
      userId: verifiedUser._id,
    });

    return newComment.save();
  },
};

module.exports = { register, login, createPost, updatePost, deletePost, addComment };
