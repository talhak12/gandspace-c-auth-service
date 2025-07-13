const { checkSchema } = require('express-validator');

export default checkSchema({
  email: {
    errorMessage: 'email required',
    notEmpty: true,
    trim: true,
  },
});
