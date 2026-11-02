import { z } from 'zod';

// Mirrors server/src/validators/contact.js so errors show instantly in the browser
export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(80, 'Name is too long'),
  email: z.string().trim().email('Enter a valid email').max(160, 'Email is too long'),
  message: z
    .string()
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message is too long (2000 characters max)'),
  // Honeypot: hidden from people, bots tend to fill it
  website: z.string().max(200).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;