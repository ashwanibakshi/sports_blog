const config  = require('./dbconfig');
const sql     = require('mssql');
const bcrypt  = require('bcrypt');
const connect = require('../config/dbconfig');

     // date string //
     var d = new Date();
     var mm = d.getMonth() + 1;
     var dd = d.getDate();
     var yy = d.getFullYear();
     var datee = new Date().toISOString().split('T')[0]
     // xxxxxxxxxxxx //


     module.exports.getData=(fn)=>{
     try{
          connect.query('select * from users',(err,data)=>{
               if(data){
                    fn(null,data);
               }
               else{
                    fn(err,null);
               }
          });
          
     }
     catch(error){
          fn(error,null);
          }
     }

     module.exports.registerUser=(user,fn)=>{
          try {
               connect.getConnection((err,connection)=>{
               if(err){
                    console.log(err);
                    fn(err,null);
               }
               else{
               const email = {'email':user.email}
               const sql  = 'select * from users where email = '+connect.escape(user.email);
               connection.query(sql,(err,data)=>{
                    connection.release(); 
                    if(err){
                         
                         fn(err,null);
                    }
                    else{
                    if(data){
                    
                         console.log('regist',data);
                         fn('user already registered',null);
                    }
                    else{
                         bcrypt.genSalt(10,(err,salt)=>{
                              bcrypt.hash(user.password,salt,(err,hash)=>{
                              console.log(user.password)
                              user.password= hash;
                              
                              var users={
                                   'fname':user.fname,
                                   'lname':user.lname,
                                   'email':user.email,
                                   'pwd':user.password,
                                   'registerdate': datee,
                                   'lastlogin':"00-00-00",
                                   'udesc':'null'
                              }
                              console.log('after hash',user.password);
                              var sql = "insert into users set ?";
                              connection.query(sql,[users],(err,regis)=>{
                                   connection.release(); 
                                   if(err){
                                        
                                        fn(err,null);
                                        
                                   }
                                   else{
                                        
                                        console.log('registered',regis.affectedRows);
                                        fn(null,regis.affectedRows);
                                        
                                   }
                              }); //insert end
     
                         }); // hashing end

                         }); //bcrypt end

                    }
                    } //else end
               }); 
               }
          }); //connection end here 
          } 
          catch (error) {
               fn(error,null);
          }
     }


     module.exports.checkEmail=(email,fn)=>{
          try {
               connect.getConnection((err,connection)=>{
                    if(err){
                         console.log(err);
                         fn(err,null);
                    }
                    else{
                    var sql = 'select * from users where email= '+connect.escape(email);
                    connection.query(sql,(err,result)=>{
                         connection.release();
                         if(err){
                              fn(err,null);
                         }
                         else{
                    console.log('email result',result);
                    fn(null,result); 
                         }
                    });
               } //else end
               });
          } catch (error) {
               fn(error,null);
          }
     }

     module.exports.comparePass=(pass,hash,fn)=>{
               try {
                    bcrypt.compare(pass,hash,(err,match)=>{
                         if(match){
                              fn(null,match);
                         }  
                         else{
                              fn(err,null);
                         }
                    });
               } catch (error) {
                    fn(error,null);
               }
     }


     //---------------------------- Dash Board  ----------------------------------//

     module.exports.addPost = (article,fn)=>{
          try {
          var user =  {
          'title'    :article.title,
          'metadesc' :article.metadesc,
          'slug'     :article.slug,
          'createdat':datee,
          'category' :article.category,
          'content'  :article.content,
          'image'    :article.image,
          'updatedat':null,
          'userid'   :article.userid
          }
          connect.getConnection((err,connection)=>{
               if(err){
                    console.log(err);
                    fn(err,null);
               }
               else{
               var sql = 'insert into post set '+connect.escape(user);
               connection.query(sql,(err,result)=>{
                    connection.release();
                    if(err){
                         fn(err,null);
                    }
                    else{
                         fn(null,result.affectedRows)                   
                    }
               });
               }//else end
               });
          } catch (error) {
               fn(error,null);
          }
     }

     module.exports.showAllPost =(pageNo,fn)=>{
          try {
               var pageNo = parseInt(pageNo);
               var numPerPage = 5;
               var skip = (pageNo-1) * numPerPage; 
               var limit = skip + ',' + numPerPage;

               connect.getConnection((err,connection)=>{
                    if(err){
                         console.log(err);
                         fn(err,null);
                    }
                    else{
                    connection.query('Select * from post order by pid desc LIMIT ' + limit,(err,result)=>{
                         connection.release();
                         if(err){
                              fn(err,null);
                         }
                         else{
                              console.log('resilt',result);
                              fn(null,result);
                         }
                    });  
               }
               });
          } catch (error) {
               fn(error,null);
          }
     }

     module.exports.count=(fn)=>{
          try {   
               connect.getConnection((err,connection)=>{
                    if(err){
                         console.log(err);
                         fn(err,null);
                    }
                    else{
                    connection.query('select count(*) as title from ??',["post"],(err,count)=>{
                         connection.release();
                         if(err){
                              fn(err,null);
                         }
                         else{
                              console.log(count[0].title)
                              fn(null,count);
                         }
                    });
               }
               });   
          } catch (error) {
               fn(error,null);
          }
     }





     module.exports.editData=(id,fn)=>{
     try {
          connect.getConnection((err,connection)=>{
               if(err){
                    console.log(err);
                    fn(err,null);
               }
               else{
               connection.query('select * from ?? where pid = ?',["post",id],(err,result)=>{
                    connection.release();
                    if(err){
                         fn(err,null);
                    }
                    else{
                         fn(null,result);
                    }
               });
               }
          });
     } 
     catch (error) {
          fn(error,null);
     }
     }

     module.exports.editPost = (article,fn)=>{
          try { 
               connect.getConnection((err,connection)=>{
                    if(err){
                         console.log(err);
                         fn(err,null);
                    }
                    else{
                    if(!article.image){
                         article.updatedat = datee;
                         connection.query('update post set title=?,metadesc=?,slug=?,category=?,content=?,updatedat=?,userid=? where pid = ?',
               [article.title,article.metadesc,article.slug,article.category,article.content,article.updatedat,article.userid,article.pid],(err,result)=>{
                    connection.release();
                              if(err){
                                   fn(err,null);
                              }
                              else{
                                   fn(null,result.affectedRows);
                              }
                         });
                    }
                    else{
                         article.updatedat = datee;
                         connection.query('update post set title=?,metadesc=?,slug=?,category=?,content=?,updatedat=?,userid=?,image=? where pid = ?',
               [article.title,article.metadesc,article.slug,article.category,article.content,article.updatedat,article.userid,article.image,article.pid],(err,result)=>{
                    connection.release();
                              if(err){
                                   fn(err,null);
                              }
                              else{
                                   fn(null,result.affectedRows);
                              }
                         });
                    } 
               }//else end   
               });  
          } catch (error) {
               fn(error,null);
          }
     }

     module.exports.deletePost=(id,fn)=>{
          try {
               connect.getConnection((err,connection)=>{
                    if(err){
                         console.log(err);
                         fn(err,null);
                    }
                    else{
                    connection.query('delete from ?? where pid = ?',["post",id],(err,result)=>{
                         connection.release();
                         if(err){
                              fn(err,null);
                         }
                         else{
                              fn(null,result.affectedRows);
                         }
                    });
               } //else end
               });
          } catch (error) {
               fn(error,null);
          }
     }




     //---------------------------- front -------------------------//


     module.exports.index = (page,perpage,fn)=>{
     try {
          var pageNo = parseInt(page);
               var numPerPage = perpage;
               var skip = (pageNo-1) * numPerPage; 
               var limit = skip + ',' + numPerPage;
             connect.getConnection((err,connection)=>{
               if(err){
                    console.log(err);
                    fn(err,null);
               }
               else{
         connection.query('Select * from post where NOT category = ? AND NOT category = ? AND NOT category = ? order by pid desc LIMIT ' + limit, ["photos", "latest news", "videos"], (err, result) => {
                         connection.release();
                         if (err) {
                              fn(err, null);
                         }
                         else {
                              console.log('resilt', result);
                              fn(null, result);
                         }
                    });
               } //else ends
          });
     } catch (error) {
          fn(error,null);
     }
     }

     module.exports.indexcount=(fn)=>{
          try {
          connect.getConnection((err,connection)=>{
               if(err){
                    console.log(err);
                    fn(err,null);
               }
               else{
               connection.query('select count(*) as title from ?? where NOT category= ? AND NOT category= ? AND NOT category= ? ',["post","photos","latest news","videos"],(err,result)=>{
                    connection.release();
                    if(err){
                         fn(err,null);
                    }
                    else{
                         console.log('resilt',result[0].title);
                         fn(null,result);
                    }
               });
               } //else end
          });
               
          } catch (error) {
               fn(error,null);
          }
     }



     module.exports.singlePage=(slug,fn)=>{
               try {
               connect.getConnection((err,connection)=>{
                    if(err){
                         console.log(err);
                         fn(err,null);
                    }
                    else{
                    connection.query('select * from post where slug= ?',[slug],(err,result)=>{
                         connection.release();
                         if(err){
                              fn(err,null);
                         }
                         else{
                              fn(null,result);
                         }
                    
                    });
               } //else end
               });
               } catch (error) {
                    fn(error,null);
               }
     }

     module.exports.category=(categ,page,perpage,fn)=>{
          try {
               var pageNo = parseInt(page);
               var numPerPage = perpage;
               var skip = (pageNo-1) * numPerPage; 
               var limit = skip + ',' + numPerPage;
          connect.getConnection((err,connection)=>{
               if(err){
                    console.log(err);
                    fn(err,null);
               }
               connection.query('Select * from ?? where category = ? order by pid desc LIMIT ' + limit,["post",categ],(err,result)=>{
                    connection.release();
                    if(err){
                         fn(err,null);
                    }
                    else{
                         console.log('result',result);
                         fn(null,result);
                    }
               });
          });
          } 
          catch (error) {
               fn(error,null);     
          } 
     }

     module.exports.categoryCount=(category,fn)=>{
          try {
               connect.getConnection((err,connection)=>{
                    if(err){
                         console.log(err);
                         fn(err,null);
                    }
                    else{
                    connection.query('select count(*) as title from ?? where category=?',["post",category],(err,result)=>{
                    connection.release();
                         if(err){
                              fn(err,null);
                         }
                         else{
                              console.log('resilt',result[0].title);
                              fn(null,result);
                         }
                    });
               }
               });
          } catch (error) {
               fn(error,null);
          }
     }

     module.exports.sidedata=(fn)=>{
          try {
               connect.getConnection((err,connection)=>{
               if(err){
                    console.log(err);
                    fn(err,null);
               }
               else{
                    connection.query('select * from post where category=? order by createdat desc LIMIT ?',["latest news",4],(err,lnews)=>{
                         
                         if(err){
                              fn(err,null);
                         }
                         else{
               connection.query('select * from post where category=? order by createdat desc LIMIT ?',["photos",4],(err,photo)=>{
               
                                   if(err){
                                        fn(err,null);
                                   }
                                   else{
               connection.query('select * from post where category=? order by createdat desc LIMIT ?',["videos",4],(err,video)=>{
                    connection.release();
                                   if(err){
                                        fn(err,null);
                                   }
                                   else{
                                        fn(null,lnews,photo,video);
                                   }
               
                                   });        
                              }
                              });
                         }
               });
               }
               });
               
          } catch (error) {
               fn(error,null);
          }
     }

     module.exports.nextprevious = (slug,fn)=>{
          try {
            connect.getConnection((err,connection)=>{
              if(err){
                   console.log('conn err',err);
                   fn(err,null,null);
              }
              else{  
                connection.query('select * from post where pid < (select pid from post where slug = ? ) order by pid desc limit ?',[slug,1],(err,previous)=>{
                        if(err){
                             console.log('prev err',err);
                             fn(err,null,null);
                        }
                        else{
                          connection.query('select * from post where pid > (select pid from post where slug = ? ) order by pid limit ?',[slug,1],(err,next)=>{
                               connection.release();
                              if(err){
                                   console.log('nex err',err);
                                   fn(err,null,null);
                              }
                              else{
                                   console.log('nex prev',next,previous);
                                 fn(null,next,previous);
                              }
                          });
                        }
                });
              }
            });
          } catch (error) {
               fn(error,null,null);
          }
     }

     module.exports.viewsCount = (views,pid,fn)=>{
          try {
               let view=0;
            connect.getConnection((err,connection)=>{
                if(err){
                  fn(err,null);   
                }
                else{
                     if(parseInt(views)==0){
                        
                         view = 1;
                     }
                     else{
                          view = parseInt(views+1);
                          console.log('view',view);
                     }
                    
                  connection.query('update post set views=? where pid=?', [view, parseInt(pid)], (err, viewsInc) => {
                       connection.release();
                          if (err) {
                               fn(err, null);
                          }
                          else {
                               console.log('views', viewsInc.affectedRows);
                               fn(null, viewsInc.affectedRows);
                          }
                     });
                }
            });
          } catch (error) {
               fn(error,null);
          }
     }

     module.exports.popularArticle=(fn)=>{
          try {
               connect.getConnection((err,connection)=>{
                       if(err){
                          console.log('pop conn err',err);
                          fn(err,null);
                       }
                       else{
                          connection.query('select * from post order by views desc limit ?',[4],(err,pop)=>{
                              connection.release();    
                              if(err){
                                       console.log('query pop err',err);
                                       fn(err,null);
                                  }
                                  else{
                                      fn(null,pop);
                                  }
                          }); 
                       }
               });
          } 
          catch (error) {
             console.log('catch err popular',error);
             fn(error,null);
           }
         }