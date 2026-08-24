import { validationResult } from 'express-validator';

// Pair this with an array of express-validator checks in a route, e.g.:
//   router.post('/login', [body('email').isEmail(), ...], validate, controller)
// It collects any validation failures and stops the request before it ever
// reaches the controller - controllers can then assume input is already clean.
export function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}
