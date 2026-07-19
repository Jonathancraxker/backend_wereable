import { pool } from '../config/db.js'
import bcrypt from 'bcryptjs';

export const updateUserByPin = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { id } = req.params; // Se obtiene el id desde la URL
        const { pin } = req.body; // Se obtienen los datos a actualizar del cuerpo
        const pinHash = await bcrypt.hash(pin, 10);
        // Validar que los campos necesarios estén presentes
        if (!pin) {
            return res.status(400).json({ message: "Por favor proporciona el PIN" });
        }
        const [result] = await connection.query(
            "UPDATE usuarios SET pin_encriptado = ? WHERE id = ?",
            [pinHash, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json({ message: "PIN actualizado exitosamente" });
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    } finally {
        connection.release();
    }
};