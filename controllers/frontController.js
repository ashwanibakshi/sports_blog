const dboperation   = require('../config/dboperations');

var errors=[];
module.exports.index =(req,res)=>{
    try {
        var page=1;
        var perpage=8;
        if(req.query.page){
            page=req.query.page;
        }
        dboperation.index(page,perpage,(err,data)=>{
             if(data.length>0){
             dboperation.indexcount((err,count)=>{
                   if(count){
             dboperation.sidedata((err,lnews,photo,video)=>{
                               if(err){
                                console.log('side err',err);
                                res.render('front/404');
                               }
                           else{
             dboperation.popularArticle((err,pop)=>{
                  if(err){
                       console.log('pop err control',err);
                       res.render('front/404');
                  }
                  else{
                       // console.log('data index',data.length);
                       res.render("front/index",{
                        data: data,
                        current: page,
                        pages: Math.ceil(count[0].title / perpage),
                        title:'index',
                        url:'http://localhost:3000/blog/index',
                        stitle:'blogging page',
                        desc:'this is a demo page ',
                        indextitle:'articles',
                        lnews:lnews,
                        photo:photo,
                        video:video,
                        popdata:pop
                     });
                  }
                }); //popArticle ends here
                           }
                     }); // side data ends here
                   }
                   else{
                       console.log(err);
                       res.render('front/404');
                   }
             }); //indexcount ends here
            }
             else{
                 console.log(err);
                 res.render('front/404');
             }
        }); //index ends here 
    } catch (error) {
        console.log(error.message);
        res.render('front/404');
    }
}

module.exports.singlePage=(req,res)=>{
    try {
        dboperation.singlePage(req.params.slug,(err,data)=>{
            if(err){
                res.render('front/404');
            }
           else if(data.length>0){
               dboperation.sidedata((err,lnews,photo,video)=>{
                   if(err){
                       console.log('side err',err);
                       res.render('front/404');
                   }
                   else{
                console.log('sdsd',data);
                dboperation.nextprevious(req.params.slug,(err,next,previous)=>{
                    if(err){
                        console.log('next prev',err);
                        res.render('front/404');
                    }
                    if(data[0].views==null){
                        data[0].views=0;
                    }
                 dboperation.viewsCount(data[0].views,data[0].pid,(err,viewsCount)=>{
                     if(err){
                         console.log('viewsCount',err);
                         res.render('front/404');
                     }
                     else{
                         dboperation.popularArticle((err,popdata)=>{
                             if(err){
                                 console.log('cont popdata err',err);
                             }
                             else{
                                res.render('front/article',{
                                    title:data[0].title,
                                    data:data,
                                    url:'http://localhost:3000/blog/'+req.params.slug,
                                    stitle:data[0].title,
                                    desc:data[0].metadesc,
                                    lnews:lnews,
                                    photo:photo,
                                    video:video,
                                    next:next,
                                    previous:previous,
                                    popdata:popdata
                                          });
                                   }
                                 }); //popular article ends here
                             }
                          }); //viewsCount ends
                      }); //next prev ends
                     }
                   });  //side data ends
                } //else if ends
            });
        } 
        catch (error) {
        console.log('slug catch error',error.message);
        res.render('front/404');
    }
}


module.exports.category=(req,res)=>{
     try {
          var page = 1;
          var perpage = 8;
          if(req.query.page){
              page  = req.query.page;
          }
        dboperation.category(req.params.name,page,perpage,(err,data)=>{
           if(data.length>0){
               dboperation.categoryCount(req.params.name,(err,count)=>{
                   if(count){
                dboperation.sidedata((err,lnews,photo,video)=>{
                    dboperation.popularArticle((err,popdata)=>{
                        res.render('front/index',{
                            data: data,
                            current: page,
                            pages: Math.ceil(count[0].title / perpage),
                            title:'index',
                            url:'http://localhost:3000/blog/index',
                            stitle:'blogging page',
                            desc:'this is a demo page',
                            indextitle:req.params.name,
                            lnews:lnews,
                            photo:photo,
                            video:video,
                            popdata:popdata
                            });
                        }); //popularArticle 
                      }); //side data ends here
                   } //categorycount if end here
                   else{
                       console.log('error',err);
                       res.render('front/404');
                   }
               }); //categoryCount ends here
           }
           else{
               console.log(err);
               res.render('front/404');
           }
        }); //category ends here
     } catch (error) {
         console.log(error);
         res.render('front/404');
     }
}


// module.exports.sidedata=(req,res)=>{
//     try {
//         dboperation.sidedata((err,lnews)=>{
//           if(lnews){
//               console.log('lnews',lnews);
//               res.json({data:lnews})
//           }
//           else{
//               res.json({data:err});
//           }
//         });
//     } catch (error) {
//         console.log(err);
//     }
// } 