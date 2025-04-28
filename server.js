require('dotenv').config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const userRoutes = require("./routes/userRoutes.js");

const app = express();
app.use(express.json());

app.use(cors({
    origin: process.env.ALLOWED_ORIGINS.split(","),
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Content-Type, Authorization"
}));

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

app.use(express.static(path.join(__dirname,"public")));

app.use("/api/users",userRoutes);

app.use(express.urlencoded({extended:true}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.get("/", (req, res) =>{
    res.render("index");
});