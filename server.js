//Importing node dependencies 
import express from  'express';
import path from 'path';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import crypto from 'crypto';
import mongojs from 'mongojs'




//importing models 
import bikeModel from './models/bikemodel';
import User from './models/usermodel';

//Constants

const  RCD_LIMIT = 8; 

let app = express();

let conn = "mongodb://localhost:27017/grabOnRent"

mongoose.connect(conn,{ useMongoClient:true });
//===============Form Objects ============

let user  = User.userModel; 
let saveUser = User.saveToDb;

let bikeFilters= {
    location:"",
    type:"",
    startDate:"",
    starttime:"",
    endDate:"",
    endTime:""
} 


// ==============Rendering of Body Parser to fetch data=================================

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ==================Handling Client Requests===========
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


//Function to handle rest calls

   let genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
    };
    
   let hashPass = function(password, salt){
    let hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    let value = hash.digest('hex');
    return  value;
    };

//API for registering users

app.post('/saveUsers',function(req,res){
     
     let userInfo =  {
         name : req.body.name,
         email : req.body.email,
         pass :  req.body.password,
         salt:  genRandomString(req.body.password.length)
     };   


      let reqUser = new user({
          name : userInfo.name,
          email: userInfo.email,
          pass : {
              hashVal :  hashPass(userInfo.pass,userInfo.salt),
              salt: userInfo.salt
            }
      });

      saveUser(reqUser, function (err, data) {
    
    if (err) throw err;
    else {
        if (data) { 
            res.status(200).send(data);
        } else {
        res.status(500).send();
        }
        }
    });


});
//===================API for User Login==========
app.post('/validateUser',function(req,res){
     
     

     let ValuserInfo =  {
         email : req.body.email,
         pass :  req.body.password,
         salt:  genRandomString(req.body.password.length)
     };   
     var hashVal = hashPass(ValuserInfo.pass,ValuserInfo.salt);

 let db = mongojs('grabOnRent', ['usermodels']);
    
    db.bikeModel.find({"email":ValuserInfo.email, "pass.hashVal" : hashVal }, ( err, doc ) => {
        if (err) {
            console.log(err);
        }else {
            res.json(doc);
        }
    });

});




//====API for fetching bike data from the database and returning the results ======
app.post('/fetchBikeFilters',function(req,res){
    let  bikeRes = [];
    let  bikeSendRes = [];
    let db = mongoose.connection;

    db.once('open',function(){
       // db.bikeModels.find({ "startDate": bikeFilters.startDate, });
        db.collection("bikeModel").find
    })

    for(var i = 0;i < RCD_LIMIT; i++){
           
    }
});

app.get('/fetchAllBikes',function(req,res){
    let  bikeRes = [];
    let  bikeSendRes = [];

    let db = mongojs('grabOnRent', ['bikeModel']);
    
     db.bikeModel.find( (err, docs) => {
        if (err) {
           console.error(err); 
        }else{
           res.json(docs);             
        }
    });
});
  



app.listen(4000,function(){
    let host = "127.0.0.1";
    let port = 4000;
    console.log("Listening to "+ host + ":" + port);
});