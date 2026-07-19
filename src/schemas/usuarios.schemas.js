import z from 'zod';
// Expresión regular para validar que el PIN contenga solo números
const pinRegex = /^\d+$/; 

export const registroSchema = z.object({
    nombre: z.string({ required_error: 'El nombre es requerido' }).nonempty('El nombre no puede estar vacío'),
    email: z.string({ required_error: 'El email es requerido' }).nonempty('El email no puede estar vacío').email({ message: 'Correo no válido' }),
    pin: z.string({ required_error: 'El PIN es requerido' }).nonempty('El PIN no puede estar vacío').regex(pinRegex, { message: 'El PIN debe contener solo números' }).min(4, { message: 'El PIN debe tener mínimo 4 dígitos' }).max(4, { message: 'El PIN debe tener máximo 4 dígitos' })
});

export const loginSchema = z.object({
    email: z.string({ required_error: 'El email es requerido' }).nonempty('El email no puede estar vacío').email({ message: 'Correo no válido' }),
    pin: z.string({ required_error: 'El PIN es requerido' }).nonempty('El PIN no puede estar vacío').regex(pinRegex, { message: 'El PIN debe contener solo números' }).min(4, { message: 'El PIN debe tener mínimo 4 dígitos' }).max(4, { message: 'El PIN debe tener máximo 4 dígitos' })
});

export const updatePinSchema = z.object({
    pin: z.string({ required_error: 'El PIN es requerido' }).nonempty('El PIN no puede estar vacío').regex(pinRegex, { message: 'El PIN debe contener solo números' }).min(4, { message: 'El PIN debe tener mínimo 4 dígitos' }).max(4, { message: 'El PIN debe tener máximo 4 dígitos' })
});