var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/skillsswapper');
var userItems = require('../model/userItem');
var userProfile = require('../model/userProfile');
var user = require('../model/user');
var await = require('asyncawait/await');

var offers = mongoose.Schema({
  userID:String,
  itemCodeOwn: String,
  itemCodeWant:String,
  itemStatus:String,
},{collection:'offers'});

var Offers = mongoose.model('offers',offers);

const addOffer  = async function(userID,itemCodeOwn,itemCodeWant,itemStatus){
  var offer = new Offers({
    userID: userID,
    itemCodeOwn:itemCodeOwn,
    itemCodeWant:itemCodeWant,
    itemStatus:itemStatus
  })
  offer.save();
}
const getOffer = async function(userID){
  const arr = await Offers.find({userID: userID});
  return arr;
}
const getAllOffers = function(){
  const arr = Offers.find({});
  return arr;
}

const updateUserOfferStatus = async function(itemId,status){
  await Offers.update({itemCodeOwn: itemId},{$set:{itemStatus:status}}).exec();
  await Offers.update({itemCodeWant: itemId},{$set:{itemStatus:status}}).exec();
}

const deleteOffer = async function(itemCode){
  await Offers.findOneAndRemove({itemCodeOwn:itemCode });
  await Offers.findOneAndRemove({itemCodeWant:itemCode });
}
const getItemWithItemWantCode =  function(itemCode){
    const arr = Offers.findOne({itemCodeWant:itemCode});
    return arr;
}
module.exports.getOffer = getOffer;
module.exports.deleteOffer = deleteOffer;
module.exports.getAllOffers = getAllOffers;
module.exports.addOffer = addOffer;
module.exports.updateUserOfferStatus = updateUserOfferStatus;
module.exports.getItemWithItemWantCode = getItemWithItemWantCode;
