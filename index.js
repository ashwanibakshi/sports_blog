const express       =  require('express');
const bodyParser    =  require('body-parser');
const path          =  require('path');
const session       =  require('express-session');
const mysql         =  require('mysql');
const connect       =  require('./config/dbconfig');

//init app
const app = express();

//connect to server

connect.getConnection((err)=>{
    if(err){
        console.log(err);
        connect.end();
    }
    else{
    console.log('connect to server');
    }
})

//connection middleware 
app.use((req,res,next)=>{
    res.locals.con=connect;
    next();
});

//view-enigne
app.set('view engine','ejs');

//static folder path
app.use(express.static(path.join(__dirname,'/public')));

//static folder path for froala file upload
app.use('/public',express.static(path.join(__dirname,'/public')));

//flora
app.use('/froalacss',express.static(__dirname+'/node_modules/froala-editor/css/froala_editor.pkgd.min.css'));
app.use('/froalajs',express.static(__dirname+'/node_modules/froala-editor/js/froala_editor.pkgd.min.js'));

//fetch form-data
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//express-session
app.use(session({
    secret:'mysecret_123456',
    resave:false,
    saveUninitialized:false
}));

// no-caching
app.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next()
});


//default page load
app.get('/',(req,res)=>{
    res.redirect('/blog/index');
});
    

//routes
app.use('/dash',require('./routes/dash'));
app.use('/user',require('./routes/user'));
app.use('/blog',require('./routes/front'));

//error handle
app.use((req,res,next)=>{
    const error = new Error('404 page not found');
    error.status= 404;
    next(error);
});

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.send(error.message);
    // res.render("views/front/404");
});



//set port
const port  = process.env.PORT || 35000;

app.listen(port,()=>console.log('server run at port'+port));