import express from 'express'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import path from 'path'
import FileStore from 'session-file-store'
import bodyParser from 'body-parser'
import { engine } from 'express-handlebars'
import MongoStore from 'connect-mongo'
import sessionsRouter from './routes/api/sessions.js'
import prductsRouter from './routes/api/products.js'
import viewsRouter from './routes/views.js'
import connectDB from './config/database.js'
import dotenv from 'dotenv'
dotenv.config()

connectDB()

const FileStoreInstance = FileStore(session)

const app = express()
const PORT = 8080;

//Configuracion de la sesion
app.use(session({
    //store: new FileStoreInstance({path: './session', ttl: 100, retries: 0}),
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://mperezro103:eccomerce24@cluster0.9wfhadf.mongodb.net/session?retryWrites=true&w=majority&appName=Cluster0',
        ttl: 100
    }),
    secret: "S3CR3T",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 180 * 60 * 1000 },
}))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
}));

app.set('view engine', 'hbs');
app.set('views', path.join(path.resolve(), 'src', 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Rutas
app.use('/api/sessions', sessionsRouter);
app.use('/api/products', prductsRouter)
app.use('/', viewsRouter);

app.get('/', (req, res) => {
    if(req.session.views) {
        req.session.views++
        res.send(`<p>Visitas: ${req.session.views}</p>`)
    } else {
        req.session.views = 1
        res.send('Bienvenido, contaremos tus visitas')
    }
    console.log("Session", req.session)
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


