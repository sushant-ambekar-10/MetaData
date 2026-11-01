import { Message } from '../models/index.js';
import { sendContactMail } from '../services/mail.js';

export async function submitContact(req, res) {
  const { website, ...data } = req.body;

  // Honeypot filled => bot. Pretend success, store nothing.
  if (website) return res.status(201).json({ success: true, data: { received: true } });

  await Message.create(data); // stored first, so nothing is lost if mail fails
  try {
    await sendContactMail(data);
  } catch (err) {
    console.error('Contact mail failed (message is saved in DB):', err.message);
  }
  res.status(201).json({ success: true, data: { received: true } });
}