const dboperation              = require('../config/dboperations');
const {validationResult}       = require('express-validator');

const errors = [];

module.exports.register=(req,res)=>{  
    res.render('./dash/register',{title:'register',error:''});
}

module.exports.registeUser=(req,res)=>{
    let error = validationResult(req)
  if(!error.isEmpty()){
    res.render('./dash/register',{title:'register',error:error.array()});
  }
  else{
  errors.pop();
  var user=req.body;
     dboperation.registerUser(user,(err,data)=>{
         if(data==1){
           res.redirect('/user/login');
         }
         else{
           errors.push({'msg':err});
           res.render('dash/register',{title:'register',error:errors});
         }
     });
    }
}

module.exports.login=(req,res)=>{
    errors.pop();
    res.clearCookie('connect.sid');
    res.render('./dash/login',{title:'login',error:''});
}
module.exports.loginUser=(req,res)=>{
    let error = validationResult(req);
  if(!error.isEmpty()){
       res.render('dash/login',{title:'login',error:error.array()});
  }
  else{
      errors.pop();
     const email =  req.body.email;
     dboperation.checkEmail(email,(err,data)=>{
        if(data!=undefined && data!=null && data!=''){
       dboperation.comparePass(req.body.password,data[0].pwd,(err,match)=>{
               if(match){
                 if(req.body.remember){
                 req.session.uid = data[0].id;
                 req.session.cookie.maxAge=365 * 24 * 60 * 60 * 1000;
                 }
                 else{
                 req.session.uid = data[0].id;
                 }
                 res.redirect('/dash/home');
               }
               else if(err){
                 errors.push({'msg':err});
                 res.render('./dash/login',{title:'login',error:errors});
               }  
               else{
                 errors.push({msg:'wrong username password'})
                 res.render('./dash/login',{title:'login',error:errors});
               } 
           });
         }
         else{
           errors.pop();
           errors.push({msg:'user is not registered'});
           res.render('/dash/login',{title:'login',error:errors});
         }
     });
    }
}


module.exports.logout=(req,res)=>{
  req.session.destroy();
    res.redirect('/user/login');
}