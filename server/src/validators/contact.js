import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(80),
  email: z.string().trim().toLowerCase().email('Enter a valid email').max(160),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(2000),
  // Honeypot: real users never see or fill this field
  website: z.string().max(200).optional(),
});