const mongoose = require ('mongoose');


const connectDB = async() => {
    await mongoose.connect(process.env.MONGODB_LOCALHOST, {
        useNewUrlParser: true,
        serializeFunctions: true,
        useUnifiedTopology: true,
    });
    console.log("MongoDB Connected")
}

module.exports = {connectDB};