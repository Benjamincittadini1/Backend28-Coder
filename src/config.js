require('dotenv').config()

const config = {
    mongoDB: {
        url: process.env.MONGO_URL,
        options: {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        }
    }
}
module.exports = config