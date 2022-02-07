const express = require('express');
const app = express()
const port = 3000;
const URl="mongodb://localhost:27017/bookStore";

var bodyParser = require('body-parser');

var urlEncode = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json());
app.use(urlEncode);
 


var mongoose=require('mongoose');
mongoose.Promise=global.Promise;

mongoose.connect(URl);
loginDb=require('./API/modal/userModal');
bookDb=require('./API/modal/bookModal');
var routes=require('./API/routes/bookRoutes')

app.use('/', routes);

// app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Book Store listening on port ${port}!`))