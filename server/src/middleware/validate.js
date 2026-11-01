// Usage: validate({ body: zodSchema, query: zodSchema })
// Parsed body replaces req.body (unknown keys stripped = no mass assignment).
// Express 5 makes req.query read-only, so parsed query lands on req.validQuery.
export const validate = (schemas) => (req, _res, next) => {
  if (schemas.body) req.body = schemas.body.parse(req.body ?? {});
  if (schemas.query) req.validQuery = schemas.query.parse(req.query);
  next();
};