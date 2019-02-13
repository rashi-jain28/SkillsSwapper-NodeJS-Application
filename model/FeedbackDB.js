var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/skillsswapper');
var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;
var feedbackSchema = new mongoose.Schema({
  offerID:{type: ObjectId},
  userID:{type:String,
    required: true},
  swapperID:{type:String},
    swappedItemCode:{type:String},
    swapperRating:{type:Number},
    swappedItemRating:{type:Number}
  },{collection:'feedback'});

  var Feedback= mongoose.model('feedback',feedbackSchema );
  var addFeedback= function(offerID, userID, swapperID, swappedItemCode, swapperRating,swappedItemRating){
    Feedback.findOneAndUpdate(
      { offerID: offerID ,
        userID:userID,
        swapperID:swapperID,
        swappedItemCode:swappedItemCode},
        {
          offerID: offerID ,
          userID:userID,
          swapperID:swapperID,
          swappedItemCode:swappedItemCode,
          swapperRating:swapperRating,
          swappedItemRating:swappedItemRating
        },
        {new:true , upsert:true},
        (err,doc)=>{
          console.log(err);
          console.log(doc);
        });
      }
      module.exports = {
        addFeedback:addFeedback
      }
