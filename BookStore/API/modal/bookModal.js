var mongoose = require('mongoose');
var Schema= mongoose.Schema;

var BookSchema= new Schema({
    id:{
        type:Number,
        unique:true,
        require:true,
    },
    bookName:{
        type:String,
        require:true,
    },
    bookDesc:String,
    bookAuthor:String,
    price:Number,
    image:String

});

module.exports= mongoose.model('BookStore',BookSchema);