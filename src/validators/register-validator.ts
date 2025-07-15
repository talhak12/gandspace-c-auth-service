const { checkSchema } = require('express-validator');

export default checkSchema({
  email: {
    errorMessage: 'email required',
    notEmpty: true,
    trim: true,
    isEmail: true,
  },

  firstName: {
    errorMessage: 'firstName required',
    notEmpty: true,
    trim: true,
  },

  lastName: {
    errorMessage: 'lastName required',
    notEmpty: true,
    trim: true,
  },

  password: {
    errorMessage: 'password length',
    notEmpty: true,
    trim: true,
    isLength: { options: { min: 1 } },
  },
});
