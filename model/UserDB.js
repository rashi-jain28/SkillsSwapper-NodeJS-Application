var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/skillsswapper');
var userItems = require('../model/userItem');
var userProfile = require('../model/userProfile');
var user = require('../model/user');
var await = require('asyncawait/await');
//const AutoIncrement = require('mongoose-sequence')(mongoose);
// schema for the item collection
var users = mongoose.Schema({
  userID:String,
  firstName: String,
  lastName:String,
  emailAddress:String,
  password:mongoose.Mixed,
  address1:String,
  address2:String,
  city:String,
  state:String,
  postCode:Number,
  country:String
},{collection:'user'});

var Users = mongoose.model('users',users);
//users.plugin(AutoIncrement, {inc_field: 'userID'});

var userProfile = mongoose.Schema({
  userID:String,
  userItem: Array,
},{collection:'offer'});

var UserProfile = mongoose.model('userProfile',userProfile);

const getUsers = async function(){
  const arr = await Users.find({ });
  return arr;
}
const getUserProfile = async function(userID){
  const arr = await UserProfile.find({userID:userID });
  return arr;
}
const getUserByEmailPassword = async function(emailAddress,pwd){
  const arr = await Users.find({emailAddress:emailAddress, password:pwd},{"userID":1});
  return arr;
}
const findUserByEmail = async function(email){
  if(email){
     return new Promise((resolve, reject) => {
       Users.findOne({ emailAddress: email })
         .exec((err, doc) => {
           if (err) return reject(err)
           if (doc) return reject(new Error('This email already exists. Please enter another email.'))
           else return resolve(email)
         })
     })
   }
}
const findUser = async function(email){
  const arr = await Users.find({emailAddress:email});
  return arr
}
const findUserByID = async function(userID){
  if(userID){
     return new Promise((resolve, reject) => {
       Users.findOne({ userID: userID })
         .exec((err, doc) => {
           if (err) return reject(err)
           if (doc) return reject(new Error('This userID already exists. Please enter another userID.'))
           else return resolve(userID)
         })
     })
   }
}
const addUser = async function(userID,firstName, lastName, emailAddress, password,
  address1,address2,city,state,postCode,country){
    var user = new Users({
      userID: userID,
      firstName: firstName,
      lastName:lastName,
      emailAddress:emailAddress,
      password:password,
      address1:address1,
      address2:address2,
      city:city,
      state:state,
      postCode:postCode,
      country:country
    })
    const arr = user.save();
    console.log(arr);
  }

  module.exports.getUsers = getUsers;
  module.exports.getUserProfile = getUserProfile;
  module.exports.getUserByEmailPassword = getUserByEmailPassword;
  module.exports.addUser = addUser;
  module.exports.findUserByEmail = findUserByEmail;
  module.exports.findUserByID = findUserByID;
  module.exports.findUser = findUser;
