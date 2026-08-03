import { createUsuarios, verificarId, verificarCorreo } from '../models/usuarios.model.js';
import { pool } from '../config/db.js';

// Obtener usuarios
export async function getUsuarios(req, res) {
    const connection = await pool.getConnection();
    try {
        const [usuarios] = await connection.execute("SELECT id, nombre, email, tipo, activo, creado_en FROM usuarios");
        res.json(usuarios);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Crear usuario
export const createUsuario = async (req, res) => {
    const { nombre, email, pin, tipo, activo = 1} = req.body;
    try {
        const userExiste = await verificarCorreo(email);
        if (userExiste) {
            return res.status(400).json({ message: "El correo ya está registrado." });
        }
        const userId = await createUsuarios({ nombre, email, pin, tipo, activo });
        res.status(201).json({
            id: userId, nombre, email, tipo, activo
        });
    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Actualizar usuario
export const updateUsuario = async (req, res) => {
    const { id } = req.params;
    const { nombre, email, tipo, activo } = req.body;
    try {
        const user = await verificarId(id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        const connection = await pool.getConnection();
        try {
            await connection.execute(
                "UPDATE usuarios SET nombre = ?, email = ?, tipo = ?, activo = ? WHERE id = ?",
                [nombre, email, tipo, activo, id]
            );
            res.json({ message: "Usuario actualizado exitosamente" });
        } finally {
            connection.release(); 
        }
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};


// PATCH para actualizar el estado activo del usuario
export const updateUsuarioActivo = async (req, res) => {
    const { id } = req.params;
    const { activo } = req.body;
    try {
        const user = await verificarId(id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        const connection = await pool.getConnection();
        try {
            await connection.execute(
                "UPDATE usuarios SET activo = ? WHERE id = ?",
                [activo, id]
            );
            res.json({ message: "Estado del usuario actualizado exitosamente" });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error("Error al actualizar estado activo del usuario:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Eliminar usuario
export const deleteUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await verificarId(id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        const connection = await pool.getConnection();
        try {
            await connection.execute("DELETE FROM usuarios WHERE id = ?", [id]);
            res.json({ message: "Usuario eliminado exitosamente" });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};