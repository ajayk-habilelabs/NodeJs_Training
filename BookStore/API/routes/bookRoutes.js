const express = require('express');
const router = express.Router();

// import all controllers
var  SessionController =require ('../controller/bookController');


// Add routes

router.post('/addUser', SessionController.addUser);
router.post('/loginUser',SessionController.login);
router.post('/addBook',SessionController.verifyToken,SessionController.addBook);
router.post('/updateBook/:id',SessionController.verifyToken,SessionController.updateBook);


// get @API
router.get('/books',SessionController.books);
router.get('/book/By/Id/:id',SessionController.verifyToken, SessionController.bookById);


module.exports = router;
