import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';

// Crear usuario con PIN encriptado
export async function createUsuarios({ nombre, email, pin }) {
    const connection = await pool.getConnection();
    try {
        const pinHash = await bcrypt.hash(pin, 10);
        const [result] = await connection.execute(
            `INSERT INTO usuarios (nombre, email, pin_encriptado) VALUES (?, ?, ?)`,
            [nombre, email, pinHash]
        );
        return result.insertId;
    } finally {
        connection.release();
    }
}

// Verificar por ID (para la ruta del perfil)
export async function verificarId(userId) {
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(
            "SELECT id, nombre, email, creado_en FROM usuarios WHERE id = ?", 
            [userId]
        );
        return result[0];
    } finally {
        connection.release();
    }
}

// Verificar por Email (para el Login/Validación)
export async function verificarCorreo(email) {
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(
            "SELECT * FROM usuarios WHERE email = ?", 
            [email]
        );
        return result[0];
    } finally {
        connection.release();
    }
}