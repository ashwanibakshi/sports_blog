const {check}   = require('express-validator');
const { checkEmail } = require('./dboperations');


module.exports.register=[
check('fname').not().isAlphanumeric().withMessage("fname should not contain number,symbols"),
check('lname').not().isAlphanumeric().withMessage("lname should not contain number,symbols"),
check('email').isEmail().withMessage("enter valid email"),
check('password').isLength(8).withMessage("password should be 8 characater long"),
check('password').isAlphanumeric().withMessage("password should be alpha numeric")
]

module.exports.login = [
 check('email').isEmail().withMessage("enter valid email"),
 check('password').isLength(8).withMessage("password should be 8 character long")
]

module.exports.addPost=[
  check('title').not().isEmpty().withMessage('title field cant be left empty'),
  check('content').not().isEmpty().withMessage('content field cant be left empty'),
  check('metadesc').not().isEmpty().withMessage('metadescription field cant be left empty'),
  check('category').not().isEmpty().withMessage('category field cant be left empty'),
  check('image').not().isEmpty().withMessage('Image field cant be left empty'),
  check('slug').not().isEmpty().withMessage('Slug field cant be left empty')
]
