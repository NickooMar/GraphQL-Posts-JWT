//Server and GraphQL
const express = require('express');
const { graphqlHTTP } = require('express-graphql');

//MiddleWare
const { authenticate } = require('./middlewares/auth');

//Database
const { connectDB } = require('./db/index');
const schema = require('./graphql/schema');

const app = express();

//Database Connection:
connectDB();


app.use(authenticate);

app.get('/', (req, res) => {
    res.send('Welcome to my GraphQL API')
});

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
}));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
