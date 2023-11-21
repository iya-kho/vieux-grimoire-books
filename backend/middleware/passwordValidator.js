const passwordValidator = require('password-validator');

const schema = new passwordValidator();

schema
  .is()
  .min(8)
  .is()
  .max(50)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits()
  .has()
  .not()
  .spaces()
  .is()
  .not()
  .oneOf(['Passw0rd', 'Password123']);

module.exports = (req, res, next) => {
  const isValid = schema.validate(req.body.password);
  const details = schema.validate(req.body.password, { details: true });

  if (isValid) {
    next();
  } else {
    res.status(403).json(details);
  }
};
