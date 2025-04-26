require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000; //PORT si se encuentra, de lo contrario: 3000
app.listen(PORT, () => console.log(`Servidor escuchando en ${PORT}`));

// conexxión
mongoose.connect(process.env.MONGODB_URI)
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
        const usuario = await Usuario.findOne({email: emailUsuario});
        if(!usuario){
            return res.status(404).json({error: "No existe usuario con el correo introducido"});
        }
        res.json(usuario)
    }catch(error){
        console.error("Error en consulta:",error);
        res.status(500).json({error:"Error al buscar usuario"})
    }
});

