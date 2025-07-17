const { checkSchema } = require('express-validator');

export default checkSchema({
  email: {
    errorMessage: 'user name required',
    notEmpty: true,
    trim: true,
    //isEmail: true,
  },

  password: {
    errorMessage: 'password required',
    notEmpty: true,
    trim: true,
    //isLength: { options: { min: 1 } },
  },
});
