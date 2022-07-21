const res = require('express/lib/response')
const mongoose = require('mongoose')
const mongoDB = require('../db/dbMongo')
const config = require('../src/config')

const usuarioSchema = new mongoose.Schema({
    //usuario: {
        //id: {type: String, required: true, max: 4, index: true}, 
        usuario: {type: String},//, required: true, max: 100}, 
        password: {type: String}//, required: true, max: 100} 
    //}
})

const model = mongoose.model('usuarios', usuarioSchema)

const db = async() => {
    return await mongoose.connect(config.mongoDB.url, config.mongoDB.options)
}
db()
class usuarioReg extends mongoDB {
    constructor(db) {
        super(db)
    }

    listarUsuarios = async() => {return model.find({})}

    buscarXNombre = async(usuario) => {
        const result = model.find({'usuario': usuario})
        return result[0]
    }
    
    guardar = async(usuario) => {
        console.log(usuario)
        const nuevoUsuario = new model(usuario)
        await nuevoUsuario.save()
    }
}

module.exports = {usuarioReg, model}