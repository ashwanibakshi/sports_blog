const express          = require('express');
const Validation       = require('../config/form-validation');
const userControler    = require('../controllers/userController');        

const router = express.Router();
// var myarr = new Array();


// router.get('/test',(req,res)=>{
//     dboperation.getData((err,data)=>{
//          if(data){
//            res.send(data);
//          }
//          else{
//            res.send(err);
//          }
//     });
// });

router.get('/register',userControler.register);

router.post('/register',Validation.register,userControler.registeUser);

router.get('/login',userControler.login);

router.post('/login',Validation.login,userControler.loginUser);

router.get('/logout',userControler.logout);

module.exports = router;