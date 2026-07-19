import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '../config/config.js';

export function accesoToken(payload, expiresIn = '1d') {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            ACCESS_TOKEN_SECRET,
            { expiresIn },
            (err, token) => {
                if (err) reject(err);
                resolve(token);
            }
        );
    });
}