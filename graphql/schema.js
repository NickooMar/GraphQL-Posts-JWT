const { GraphQLSchema, GraphQLObjectType,  } = require('graphql');

const { users, user, posts, post } = require('./queries');
const { register, login, createPost, updatePost, deletePost, addComment } = require('./mutations')

const QueryType = new GraphQLObjectType({
    name: 'QueryType',
    description: 'The root query type',
    fields: {
        users,
        user,
        posts,
        post

    }
})

const MutationType = new GraphQLObjectType({
    name: 'MutationType',
    description: 'The root mutation type',
    fields: {
        register,
        login,
        createPost,
        updatePost,
        deletePost,
        addComment
    }
})

module.exports = new GraphQLSchema({
    query: QueryType,
    mutation: MutationType,
})