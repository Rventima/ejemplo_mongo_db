const mongoose = require("mongoose");

const EsquemaUsuario = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    esEstudianteUAM: {type: Boolean, default: false}
    },{
        versionKey : false
    }
);

module.exports = mongoose.model("Usuario", EsquemaUsuario)