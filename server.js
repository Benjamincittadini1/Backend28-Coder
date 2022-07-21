/*Desafio 12:  Usando el objeto process */
const express = require('express')
const session = require('express-session')
const {usuarioReg, model}  = require('./controller/usuariosMongoDB')
const newUser = new usuarioReg()

const passport = require('passport')
const { Strategy: LocalStrategy } = require('passport-local')

const MongoStore = require('connect-mongo')
const advancedOptins = { useNewUrlParser: true, useUnifiedTopology: true }

/* Yargs */
const args = require('./src/yargs')
const apiInfo = require('./routes/apiInfo')
/* Process */
const apiRandom = require('./routes/apiRandom')

/* database */
const usuarios = []

/* passport */
passport.use('registrarse', new LocalStrategy({
    passReqToCallback: true
}, (req, username, password, done) => {

    const usuario = usuarios.find(usuario => usuarios.nombre == nombre)
    if(usuario){ return done('Usuario ya registrado')}
    
    const user = {
        username,
        password
    }
    usuarios.push(user)
    return done(null, user)
}))

passport.use('login', new LocalStrategy.Strategy({
    usernameField: "usuario",
    passwordField: "password",
    passReqToCallback: true
}, async (req, usuario, password, done) => {
    const user = await model.findOne({usuario})
    if(!user){
        return done(null, false)
    }
    done(null, user)
}))

passport.serializeUser(function (user, done){
    done(null, user)
})

passport.deserializeUser( async function(username, done){
    const usuario = await model.findOne({username})
    done(null, usuario)
})

const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

/* ------------------------------------------------------------------- */
/*              Persistencia database                                  */
/* ------------------------------------------------------------------- */
app.use(session({
    store: MongoStore.create({ 
        mongoUrl: 'mongodb+srv://Cecilia:ceci1984@cluster1.sf6kh.mongodb.net/?retryWrites=true&w=majority',
        mongoOptions: advancedOptins
    }), 
    secret: 'sh',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 100000 }
}))

app.use(passport.initialize())
app.use(passport.session())

let messages = []
const productos = []

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.set('views', './views')
app.set('view engine', 'ejs')

/* Auth */
function isAuth(req, res, next) {
    if (req.isAuthenticated()){
        next()
    } else {
        res.redirect('/login')
    }
}

app.get('/', (req, res) => {
    let productos = [
        {nombre: 'Escuadra', precio: 20, foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Squadra_45.jpg/640px-Squadra_45.jpg"}, 
        {nombre: 'Regla', precio: 10, foto: "https://image.shutterstock.com/image-vector/school-measuring-plastic-ruler-20-260nw-615662024.jpg"}, 
        {nombre: 'Compás', precio: 20, foto: "https://thumbs.dreamstime.com/b/comp%C3%A1s-de-dibujo-aislado-rojo-132996590.jpg"}
    ]    
})

app.post('/productos', (req, res) => {
    productos.push(req.body)
    console.log(productos)
    res.redirect('/')
})

io.on('connection', function(socket){
    console.log('Un cliente se ha conectado')
    /* Emitir todos los mensajes a un cliente nuevo */
    socket.emit('messages', messages)

    socket.on('new-message', function(data){
        /* Agregar mensajes a array */
        messages.push(data)

        /* Emitir a todos los clientes */ 
        io.sockets.emit('messages', messages)
    })
})


/* Login */ 
app.post('/login', passport.authenticate("login", {successRedirect: "/home", failureRedirect: "/registrarse", passReqToCallback: true}))
app.get('/registrarse', (req, res)=>{
    res.redirect('registrarse.html')
})
app.post('/registrarse', async(req, res) => {
   await newUser.guardar(req.body)
    res.redirect('/')
})
app.get('/home', (req,res)=>{
    const { user: usuario } = req.session.passport
    res.render('productos', {usuario, productos})
} )
app.post('/logout', (req, res) => {
    //session destroy
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      })
})

app.use(apiInfo)
app.use(apiRandom)

const PORT = args.port

const srv = server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})
srv.on('error', error => console.log(`Error en el servidor ${error}`))