const router = require('express')
const { fork } = require('child_process')

const apiRandom = router()

apiRandom.get('/api/randoms', (req, res) => {
    const forked = fork('./controller/numerosRandom.js')

    forked.on('message', result => {
        forked.send(req.query)
        result !== 'start' && res.json(result)
    })
})

module.exports = apiRandom