const yargs = require('yargs')

const args = yargs()
    .default({
        port: process.argv[2] || 8080
    })
    .alias({
        p: "port"
    })
    .parse(process.argv.slice(2))

module.exports = args