import { Router } from 'express';
import { createCrud } from '../controllers/crud.factory.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { listQuerySchema, reorderSchema } from '../validators/content.js';

export function crudRouter({ Model, schema, hasSlug, sort }) {
  const c = createCrud({ Model, hasSlug, sort });
  const r = Router();

  r.get('/', optionalAuth, validate({ query: listQuerySchema }), c.list);
  r.put('/reorder', requireAuth, validate({ body: reorderSchema }), c.reorder); // before /:id
  r.get('/:id', optionalAuth, c.getOne);
  r.post('/', requireAuth, validate({ body: schema }), c.create);
  r.put('/:id', requireAuth, validate({ body: schema.partial() }), c.update);
  r.delete('/:id', requireAuth, c.remove);

  return r;
}