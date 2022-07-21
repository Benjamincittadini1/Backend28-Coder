class basicMongoDb {
    constructor(connection) {
        if (!process.env.MONGO_CONNECT) {
            this.connect = connection
            process.env.MONGO_CONNECT = true
        }
    }
}

module.exports = basicMongoDb