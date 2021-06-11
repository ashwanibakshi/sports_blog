const dboperation              = require('../config/dboperations');
const {validationResult}       = require('express-validator');
const FroalaEditor             = require('../node_modules/wysiwyg-editor-node-sdk/lib/froalaEditor');


const errors = [];


module.exports.dash=(req,res)=>{
    res.render('dash/home',{title:'home',error:''});  
}


module.exports.getAddPost=(req,res)=>{
    res.render('dash/addpost',{title:'addpost',error:''});
}

module.exports.postAddPost=(req,res)=>{
    try {
        const  path = '/uploads/'+req.file.originalname
        console.log('slug',req.body.slugg);
        const article = {
            'title':req.body.title,
            'metadesc':req.body.metadesc,
            'slug':req.body.slugg,
            'category':req.body.category,
            'content':req.body.content,
            'image':path,
            'userid':req.session.uid
        }
        dboperation.addPost(article,(err,data)=>{
            if(data){
                errors.pop();
                errors.push({msg:'data successfully added'});
                res.render('dash/addpost',{title:'addArticle',error:errors})
                // res.render('dash/addpost',{title:'addArticle',error:errors});
            }
            else if(err){
                errors.pop();
                errors.push({msg:err});
                res.render('dash/addpost',{title:'addArticle',error:errors})
            }
        });
    } catch (error) {
        errors.pop();
        errors.push({'msg':error});
        console.log(error);
        res.render('dash/addpost',{title:'addArticle',error:errors});
    }
}

module.exports.showAllPost=(req,res)=>{
   try {
    var page = 1;
    var perpage = 5;
    if(req.query.page){
      page = req.query.page;
       }
       dboperation.showAllPost(page,(err,data)=>{
         if(data){
             console.log('show data',data);
            dboperation.count((err,count)=>{
                if(err){
                    errors.push({msg:err});
                    res.render('dash/showallpost',{title:'showallpost',error:err,data:'',pages:'',current:''});
                }
                else{
                    console.log('count',count[0].title);
                res.render('dash/showallpost',{
                    data: data,
                    current: page,
                    pages: Math.ceil(count[0].title / perpage),
                    title:'showallpost' ,
                    error:''
                });
               }
            });
        }
         else{
             errors.pop();
             errors.push({msg:err});
            res.render('dash/showallpost',{title:'showallpost',error:errors,data:'',pages:'',current:''});
         }
       });
   } catch (error) {
       errors.pop();
       errors.push({msg:error});
       res.render('dash/showallpost',{title:'showallpost',error:errors,data:'',pages:'',current:''});
   }
}

module.exports.getEditPost=(req,res)=>{
    try {
        dboperation.editData(req.params.id,(err,data)=>{
            if(err){
                errors.pop();
                errors.push({msg:err});
                res.render('dash/edit',{title:'editpost',error:errors,data:''});
            }
            else{
                console.log('data',data);
                errors.pop();
                errors.push({msg:'data successfully fetched'});
                res.render('dash/edit',{title:'editpost',error:errors,data:data});
            }
         });
    }
     catch (error) {
             errors.pop();
             errors.push({msg:error});
             res.render('dash/edit',{title:'editpost',error:errors,data:''});   
    }    
}

module.exports.postEditPost=(req,res)=>{
    var article={};
    var dataa=[];
          try {
              console.log(req.file);
              if(req.file===undefined){
                article = {
                    'title':req.body.title,
                    'metadesc':req.body.metadesc,
                    'slug':req.body.slugg,
                    'category':req.body.category,
                    'content':req.body.content,
                    'userid':req.session.uid,
                    'pid':req.params.id,
                    'createdat':req.body.createdat
                  }
              }
              else if(req.file.originalname) {
                const  path = '/uploads/'+req.file.originalname
                  article = {
                    'title':req.body.title,
                    'metadesc':req.body.metadesc,
                    'slug':req.body.slugg,
                    'category':req.body.category,
                    'content':req.body.content,
                    'image':path,
                    'userid':req.session.uid,
                    'pid':req.params.id,
                    'createdat':req.body.createdat
                  }  
              }

              dboperation.editPost(article,(err,data)=>{
                  if(data==1){
                      dboperation.editData(req.params.id,(err,showData)=>{
                          if(showData){
                            errors.pop();
                            errors.push({msg:'data updated successfully'})
                            res.render('dash/edit',{title:'editpost',error:errors,data:showData});
                          }
                          else{
                              errors.pop();
                              errors.push({msg:err});
                              dataa = [{'title':req.body.title,
                              'metadesc':req.body.metadesc,
                              'slug':req.body.slugg,
                              'category':req.body.category,
                              'content':req.body.content,
                              'userid':req.session.uid,
                              'pid':req.body.pid,
                              'image':req.body.pics}]
                              res.render('dash/edit',{title:'editpost',error:errors,data:dataa});
                          }
                      });
                  }
                  else{
                      errors.pop();
                      errors.push({msg:err});
                      dataa = [{'title':req.body.title,
                      'metadesc':req.body.metadesc,
                      'slug':req.body.slugg,
                      'category':req.body.category,
                      'content':req.body.content,
                      'userid':req.session.uid,
                      'pid':req.body.pid,
                      'image':req.body.pics}]
                      res.render('dash/edit',{title:'editpost',error:errors,data:dataa});
                  }
              });
          } catch (error) {
              errors.pop();
              errors.push({msg:error});
              dataa = [{'title':req.body.title,
              'metadesc':req.body.metadesc,
              'slug':req.body.slugg,
              'category':req.body.category,
              'content':req.body.content,
              'userid':req.session.uid,
              'pid':req.body.pid,
              'image':req.body.pics}]
              res.render('dash/edit',{title:'editpost',error:errors,data:dataa});
          }
}

module.exports.deletePost=(req,res)=>{
        dboperation.deletePost(req.params.id,(err,del)=>{
            if(del==1){
                res.redirect('/dash/showAllPost');
            }
        });
}

module.exports.upload_image=(req,res)=>{
    try {
    FroalaEditor.Image.upload(req,'/public/uploads/',(err, data)=>{
                if(err){
                    console.log(err)
                    res.send(JSON.stringify(err));
                }
                else{
                    console.log(data);
                    res.send(data);
                }
      })
    } 
    catch (error) {
         res.send(JSON.stringify(error));
    }
}