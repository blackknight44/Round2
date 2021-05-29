const express = require('express');
const $ = require('jquery');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));
try{
    mongoose.connect("mongodb://localhost:27017/vita2",{useFindAndModify: true, useUnifiedTopology: true});

}catch(e){
    console.log(e);
}

const loginSchema = {
    username: String,
    password: String
};

const formSchema = {
    firstname: String,
    middlename: String,
    lastname: String,
    address: String,
    phone: String,
    email: String,
    height: String,
    weight: String
};
const Form = mongoose.model('form', formSchema);
const Login = mongoose.model('login', loginSchema );

if(Login.findOne({username: "admin"}).then(response =>{
    if(!response){
        const log = new Login({
            username: "admin",
            password: "admin"
        });
        log.save();
    }
}));

app.get('/', function (req, res){
    res.render("home");
});
app.get('/form', function (req, res){
    res.render("test");
});
app.get('/login',function(req, res){
    res.render("login");
});
app.get('/form/delete-details', function(req, res){
    res.render("delete");
});
app.post('/delete-details', function(req, res){
    const mail = req.body.delete;
    Form.findOne({ email:  mail}, function(err, form) {
        if (err) {
            res.status(400).json({message: "error"});
        }else{
            if(!form){
                res.status(400).json({message: "User Not found"});
            }else{
                const id = form.id;
            res.redirect('/form/delete-details/' + id);
            }
        }
    });
});
app.post('/form/save-details', function (req, res){
    const form = new Form({
        firstname: (req.body.fname).slice(12),
        middlename: (req.body.mname).slice(13),
        lastname: (req.body.lname).slice(11),
        address: (req.body.address).slice(9),
        phone: (req.body.phone).slice(7),
        email: (req.body.email).slice(7),
        height: (req.body.height).slice(8),
        weight: (req.body.weight).slice(8)
    });
    form.save();
    res.redirect("/menu");
});

app.get('/menu', function(req, res){
    res.render("menu");
})

app.get("/form/delete-details/:text", function(req, res){
    const id = req.params.text;
    console.log(id);
    Form.findByIdAndDelete(id, function(err, doc){
        if(err){
            res.status(400).json({message: "error"});
        }else{
            res.status(400).json({message: "Deleted"});
        }
    })
});

app.post('/login', function (req, res){
    const uname  = req.body.uname; 
    const pass = req.body.pwd;
    Login.findOne({username: uname}).then(user => {
        if(!user){
            return res.status(400).json({
                message: "Invalid username"
            });
        }else{
           if(pass == user.password){
               res.redirect('/menu');
           }
           else{
               return res.status(400).json({
                   message: "Invalid password"
               });
           }
        }
    });
});
app.listen(3000, function(){
    console.log("Server is up!");
});