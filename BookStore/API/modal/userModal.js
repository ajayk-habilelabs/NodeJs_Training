var mongoose= require('mongoose');
var Schema= mongoose.Schema;

var PostSchema=new Schema({
    userName:String,
    userEmail:{
        type:String,
        unique:true,
        require:"Please Enter Email Address"
    },
    password:String
});
module.exports= mongoose.model('userStore',PostSchema);