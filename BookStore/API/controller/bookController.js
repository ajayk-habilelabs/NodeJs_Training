var mongoose = require('mongoose');
loginDb = mongoose.model('userStore');
bookDB = mongoose.model('BookStore');
var jwt = require('jsonwebtoken');
var CryptoJS = require("crypto-js");
var multer = require('multer');
var fs = require('fs');
var path = require('path')

var Stroge = multer.diskStorage({
    destination: (req, file, next) => {
        next(null, "public/images/")
    },
    filename: (req, file, next) => {
        next(null, file.originalname);
    }
});

var upload = multer({
    storage: Stroge
}).single('image');



// Register a user 
exports.addUser = async (req, res) => {
    try {
        loginDb.find({
            'userEmail': req.body.userEmail
        }, (err, docs) => {
            if (err) {
                console.log(`Error: ` + err)
            } else {
                if (docs.length != 0 && docs[0].userEmail) {
                    res.send('<script>alert("User Already Existes")</script>')
                } else {
                    var passwordEncrypt = CryptoJS.HmacSHA1("Message", "Key").toString();
                    req.body.password = passwordEncrypt;
                    var postData = new loginDb(req.body);
                    postData.save()
                        .then(result => {
                            res.json(result);
                        }).catch(err => {
                            console.log(err);
                            res.status(400).json(err)
                        })
                }
            }
        });
    } catch (error) {
        console.log(error);
    }
};

// login api
exports.login = async (req, res) => {
    try {
        const id = req.body.userEmail;
        const password = CryptoJS.HmacSHA1("Message", "Key").toString();
        loginDb.find({
            'userEmail': id,
            'password': password
        }, (err, result) => {
            if (result.length > 0 && result) {
                var token = jwt.sign({
                    id,
                    password
                }, "AJAYAGARWAL");
                res.json({
                    token: token
                });

            } else {
                res.send('<script>alert("User Id Password wrong")</script>')
            }
        })
    } catch (error) {
        console.log(error);
    }
}

// add new book
exports.addBook = async (req, res) => {
    try {
        jwt.verify(req.token, "AJAYAGARWAL", (err, result) => {
            if (result) {
                upload(req, res, (err) => {
                    if (err)
                        return res.send(err);
                    bookDB.findOne({ 'id': req.body.id }, (err, data) => {
                        if (data) {
                            res.json("Book Already Register")
                        }
                        else {
                            var bookData = new bookDB({
                                id: req.body.id,
                                bookName: req.body.bookName,
                                bookDesc: req.body.bookDesc,
                                bookAuthor: req.body.bookAuthor,
                                price: req.body.price,
                                image: req.file.filename
                            });
                            bookData.save()
                                .then(result => {
                                    res.json(result);
                                })
                                .catch(err => {
                                    res.json(err);
                                })
                        }
                    })
                });
            }
        })
    } catch (error) {
        res.json(error);
    }
};
// update a book
exports.updateBook = async (req, res) => {
    try {
        console.log("req.body",req.body);
        console.log(req.params);
        jwt.verify(req.token, "AJAYAGARWAL", (err, result) => {
            if (result) { 
                    upload(req,res,(err)=>{
                        if(err) 
                        return res.json(err);
                        bookDB.updateOne({'id':req.params.id}, {
                            $set: {
                                bookName: req.body.bookName,
                                bookDesc: req.body.bookDesc,
                                bookAuthor: req.body.bookAuthor,
                                price: req.body.price,
                                image:req.file.filename
                            }
                        })
                        .then(result => {
                            console.log(result);
                            res.json(result);
                        }).catch(err => {
                            res.status(400).send("Unable to data Save");
                        })
                    
                    })
            }
            else {
                res.send("<script>alert('Login now')</script>")
            }
        })
    } catch (error) {
        console.log(error);
    }
};


// get all book
exports.books =(req,res)=>{
    try {
        bookDB.find({},(req,data)=>{
            res.json(data);
        })
    } catch (error) {
        res.json(error)
    }
}
exports.bookById=(req,res)=>{
    jwt.verify(req.token,"AJAYAGARWAL",(err,data)=>{
        if(data){
            bookDB.find({id:req.params.id},(err,result)=>{
                res.json(result);
            })
        }
        else{
            res.json("You are not vaild user")
        }
    })
}

//verification token
exports.verifyToken = async (req, res, next) => {
    const userTokenHeader = req.headers['authorization'];
    if (userTokenHeader) {
        const user = userTokenHeader.split(' ');
        const userToken = user[1];
        req.token = userToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

