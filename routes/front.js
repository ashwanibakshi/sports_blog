const express           = require('express');
const frontController   = require('../controllers/frontController');
const checkAuth         = require('../config/auth').auth;

const router = express.Router();

router.get('/index',frontController.index);

router.get('/:slug',frontController.singlePage);

router.get('/category/:name',frontController.category);


module.exports = router;