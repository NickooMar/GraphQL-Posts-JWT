const mongoose = require ('mongoose');


const connectDB = async() => {
    await mongoose.connect('mongodb://localhost/graphql-blog', {
        useNewUrlParser: true,
        serializeFunctions: true,
        useUnifiedTopology: true,
    });
    console.log("MongoDB Connected")
}

module.exports = {connectDB};