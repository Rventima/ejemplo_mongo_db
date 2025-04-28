require('dotenv').config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();
app.use(express.json());
app.use(cors({origin: [process.env.ALLOWED_ORIGINS]}));

app.use(helmet({  
    contentSecurityPolicy: {
        directives: {
            "default-src": ["'self'"],
            "connect-src": ["'self'", "http://localhost:3000"],
            "script-src": ["'self'", "https://cdn.jsdelivr.net"],
        },
    },      
}));

app.use(express.json({limit: "10kb"}));
app.use(express.urlencoded({ extended: true, limit: "10kb"}));

const limiter = rateLimit({
    windowMs: 15 * ( 60 * 1000), // minutos * (milisegundos en un minuto)
    max: 100
});

app.use("/api/",limiter);

const PORT = process.env.PORT || 3000; //PORT si se encuentra, de lo contrario: 3000
app.listen(PORT, () => console.log(`Servidor escuchando en ${PORT}`));

// conexxión
mongoose.connect(process.env.MONGODB_URI,{
    maxPoolSize: 1, 
    serverSelectionTimeoutMS: 5000
})
.then(() => console.log("✅Conectado a la DB"))
.catch(err => console.error("❌Error: ", err.message));

// entidad Usuario
const EsquemaUsuario = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    esEstudianteUAM: {type: Boolean, default: false} 
});

const Usuario = mongoose.model("Usuario", EsquemaUsuario);

app.post("/api/register", async (req, res) =>{
    try{
        const {email, password, esEstudianteUAM} = req.body;
        if(!email || !password){
            return res.status(400).json({
                error: "Faltan campos obligatorios"
            });
        }

        const existeUsuario = await Usuario.findOne({email});
        if(existeUsuario){
            return res.status(409).json({
                error: "Ya existe el usuario (correo)"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUsuario = new Usuario({
            email,
            password: hashedPassword,
            esEstudianteUAM
        });

        await newUsuario.save();
        res.status(201).json({
            message: "Usuario registrado"
        });
    }catch(error){
        console.error("Error al insertar: ",error);
        res.status(500).json({
            error: "Error interno en el servidor"
        });
    } 
});

app.get("/api/users/:email", async (req, res) => {
    try{
        const emailUsuario = req.params.email;
        const usuario = await Usuario.findOne({email: emailUsuario}, {password: 0, __v: 0}).exec();
        if(!usuario){
            return res.status(404).json({error: "No existe usuario con el correo introducido"});
        }
        res.json(usuario)
    }catch(error){
        console.error("Error en consulta:",error);
        res.status(500).json({error:"Error al buscar usuario"})
    }
});


app.use(express.urlencoded({extended:true}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname,"public")));

app.get("/", (req, res) =>{
    res.render("index");
});