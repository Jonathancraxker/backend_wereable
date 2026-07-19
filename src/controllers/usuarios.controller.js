import { accesoToken } from '../libs/jwt.js';
import bcrypt from 'bcryptjs';
import { createUsuarios, verificarId, verificarCorreo } from '../models/usuarios.model.js';

export const registrarUsuario = async (req, res) => {
    const { nombre, email, pin } = req.body;

    try {
        const userExiste = await verificarCorreo(email);
        if (userExiste) {
            return res.status(400).json({ message: "El correo ya está registrado." });
        }

        const userId = await createUsuarios({ nombre, email, pin });

        res.status(201).json({
            id: userId,
            nombre,
            email
        });
    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const loginUsuario = async (req, res) => {
    const { email, pin } = req.body;

    try {
        const user = await verificarCorreo(email);
        if (!user) {
            return res.status(400).json(["Error, usuario no existente"]);
        }
        const pinValido = await bcrypt.compare(pin, user.pin_encriptado);
        if (!pinValido) {
            return res.status(400).json(["El PIN ingresado es incorrecto"]);
        }
        const token = await accesoToken({ id: user.id });

        res.json({
            user: {
                id: user.id,
                nombre: user.nombre,
                email: user.email
            },
            token
        });
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const profile = async (req, res) => {
    try {
        const user = await verificarId(req.user.id);
        if (!user) return res.status(400).json(["Usuario no encontrado"]);
        
        return res.json(user);
    } catch (error) {
        console.error("Error al obtener perfil:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: "Sesión cerrada exitosamente" });
};