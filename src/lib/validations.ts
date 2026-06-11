import { z } from 'zod';

export const UserRegistrationSchema = z.object({
  username: z.string().min(3, { message: 'El usuario debe tener al menos 3 caracteres.' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
});