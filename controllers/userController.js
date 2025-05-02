const User = require("../models/User.js");
const Usuario = require("../models/User.js");
const bcrypt = require("bcryptjs");

exports.registerUser = async (req, res) =>{
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
};



exports.getUser = async (req, res) =>{
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
};

exports.updateUser = async (req, res) =>{
    try{
        const {email} = req.params;
        const updateData = req.body;

        if (updateData.email){
            const userExists = await User.findOne({
                email: updateData.email,
                _id: {$ne: req.user._id} // $ne selects everything except the objects with this value
            });
            if(userExists){
                return res.status(409).json({ error: "El correo ya pertenece a una cuenta" });
            }
        }

        if(!email){
            return res.status(400).json({error : "Email requerido para update"});
        }
        const updateUser = await User.findOneAndUpdate(
            {email},
            updateData,
            {new: true, runValidators: true}
        ).select("-password -__v");

        if(!updateUser){
            return res.status(404).json({error: "Email no encontrado"});
        }

        res.status(200).json({
            message: "Usuario actualizado",
            user: {
                email: updatedUser.mail,
                esEstudianteUAM: updateUser.esEstudianteUAM
            }
        });
    }catch(error){
        res.status(500).json({error: "Error interno del servidor"});
    }
};