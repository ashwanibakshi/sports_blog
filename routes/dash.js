const express         = require('express');
const dboperation     = require('../config/dboperations');
const dashController  = require('../controllers/dashController');
const validation      = require('../config/form-validation');
const multer          = require('multer');
const checkAuth       = require('../config/auth').auth;
const { check } = require('express-validator');

const router = express.Router();

//multer
var storage = multer.diskStorage({
      destination:(req,file,cb)=>{
  
         cb(null,'public/uploads')
      },
      filename:(req,file,cb)=>{
           
        cb(null,file.originalname);
      }  
  });
  
  
  var upload = multer({storage:storage});

router.get('/home',checkAuth,dashController.dash);

router.get('/addpost',checkAuth,dashController.getAddPost);

router.post('/addpost',checkAuth,upload.single('image'),validation.addPost,dashController.postAddPost);

router.get('/showAllPost',checkAuth,dashController.showAllPost);

router.get('/editPost/:id',checkAuth,dashController.getEditPost);

router.post('/editPost/:id',upload.single('image'),checkAuth,dashController.postEditPost);

router.get('/deletePost/:id',checkAuth,dashController.deletePost);

router.post('/upload_image',checkAuth,dashController.upload_image);

module.exports = router;