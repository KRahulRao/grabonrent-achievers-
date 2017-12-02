
import mongoose from 'mongoose';

let bikeModel  =  mongoose.model('bikeModel',{
    bikeName : String,
    pricePerHr : String,
    bikeModel : String,
    bikeYear : Date,
    registrationNumber : String,
    owner : String,
    bikeStatus : String,
    currentLocation : String,
    images : [
        {
            img : String
        }, 
        {
            img : String
        }, 
        {
            img : String
        }, 
        {
            img : String
        }
    ],
    bookings : [ 
        {
             bookingIdRef : String,
             lastBookingDate : Date
        }
    ]
});


let saveBikeToDb= function(content,callback){
     content.save(callback);
};

module.exports ={
    bikeModel,
    saveBikeToDb
};