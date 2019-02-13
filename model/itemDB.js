// to connect to the database
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/skillsswapper');
var item = require('../model/item');
var await = require('asyncawait/await');

// schema for the item collection
var item = mongoose.Schema({
  itemCode:String,
  itemName: String,
  name:String,
  category:String,
  description:String,
  rating:Number,
  imageURL:String,
  userID:String,
  status:String
},{collection:'item'});

var Items = mongoose.model('item',item);
const getItems = async function(){
  const arr = await Items.find({ });
  return arr;
}

const getItem = async function(itemId){
  const arr = await Items.find({itemCode:itemId });
  return arr;
}

const getUserItems = async function(userID){
  const arr = await Items.find({userID:userID });
  return arr;
}
const deleteItem = async function(itemCode){
  const arr = await Items.findOneAndRemove({itemCode:itemCode });
  return arr;
}

const getGroupItems = async function(itemIDS){
  const arr = await Items.find({itemCode:{$in:itemIDS}});
  return arr;
}


const getCategory = async function(){
  const arr = await Items.distinct("category");
  return arr;
}

const updateItem = async function(itemCode,status){
  const arr = await Items.update({itemCode:itemCode},{$set:{status:status}});
}


const checkAvailableItems = async function(itemCode,userID){
  const arr = await Items.find({itemCode:{$nin:itemCode},userID:userID});
  return arr;
}

const updateRatingForItem= async function(ic, rating){
  const arr = await Items.update({itemCode:ic},{$set: {rating:rating}}).exec();
}

module.exports.getItem = getItem;
module.exports.deleteItem = deleteItem;
module.exports.checkAvailableItems = checkAvailableItems;
module.exports.updateItem = updateItem;
module.exports.getItems = getItems;
module.exports.getUserItems = getUserItems;
module.exports.getGroupItems = getGroupItems;
module.exports.getCategory = getCategory;
module.exports.updateRatingForItem = updateRatingForItem;
