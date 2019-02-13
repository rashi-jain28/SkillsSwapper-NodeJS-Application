var express = require('express');
var userDB = require('../model/userDB');
var userProfile = require('../model/userProfile');
var feedbackDB = require('../model/FeedbackDB');
var item = require('../model/itemDB');
var offerDB = require('../model/offerDB');
var app = express();
var session = require('express-session');
app.set('view engine', 'ejs');
var currentUser = 'rjain12';
const { check, validationResult} = require('express-validator/check');
// for hashing
var bcrypt = require('bcrypt');
var BCRYPT_SALT_ROUNDS = 12;
app.use(session({
  secret: 'this-is-a-secret-token'
}));

exports.myItem  = function(req, res){
  var updated = false;
  finalItems =[];
  if(req.session.theUser === undefined){
    res.render('myItems',{items: ""});
}
else {
  stat = updateStatus();
  stat.then(function(statt){

    //console.log("-----------------------after update");
    it = item.getUserItems(req.session.theUser);
    it.then(function(result){
      result.forEach(function(individualResult){
        if(individualResult.status === 'Available' || individualResult.status === 'Pending'
        || individualResult.status === 'Offered'){
          finalItems.push(individualResult)
        }
      });


      if(req.query.action === 'update'){
        it= item.getItem(req.query.itemCode);
        it.then(function(result){
          if(result[0].status === 'Available'){
            res.redirect('../categories');
          }
          else{
            res.redirect('../mySwaps');
          }
        });
      }

      if(req.query.action === 'offer'){
        add = offerDB.addOffer(req.session.theUser,req.query.itemCode, req.query.itemOffered,"Offered");
        add.then(function(r){
          otherUser = item.getItem(req.query.itemOffered);
          otherUser.then(function(ee){
            id=ee[0].userID;
            add1 = offerDB.addOffer(id,req.query.itemOffered,req.query.itemCode,"Pending");
            add1.then(function(result){
              res.redirect('../myItems');
            })
          })
        })
      }
      if(req.query.action === 'delete'){
        del = item.deleteItem(req.query.itemCode);
        del.then(function(result){
          res.redirect('../myItems');
        });
      }
      if(req.query.action === undefined ){
        res.render('myItems',{items: result});
      }

    });
  });
}
};

exports.swap = function(req,res){
  NotAvailableItems=[];
  status=[];
  if(req.session.theUser != undefined){
    off = offerDB.getOffer(req.session.theUser);
    off.then(function(result){
      result.forEach(function(ii){
        if(ii.itemStatus != "Available"){
          NotAvailableItems.push(ii.itemCodeOwn);
        }
      });
      var items = item.getItem(req.params.itemCode);
      items.then(function(resultss){
        availableItems = item.checkAvailableItems(NotAvailableItems,req.session.theUser);
        availableItems.then(function(op){
          res.render('swap', {item:resultss[0], availableItems:op});
        })
      });
    });
  }

};

exports.mySwaps= async function(req, res,next){

  user = userDB.getUsers();
  user.then(function(result){
    var items = [];
    var userItems=[];
    var swapItems = [];
    var status = [];
    if(req.session.theUser === undefined){
      res.render('mySwaps',{items: "", swapItems:"", status:""})

}

else {
  //console.log('**************************inside *****************');
  userP = offerDB.getOffer(req.session.theUser);
  userP.then(function(result){
    //console.log(result);
    result.forEach(function(IndividualItem){
      if(IndividualItem.itemStatus === 'Pending' || IndividualItem.itemStatus == 'Offered'){
        items.push(IndividualItem.itemCodeOwn);
        //console.log(items);
        swapItems.push(IndividualItem.itemCodeWant);
        userItems.push(IndividualItem);
        status.push(IndividualItem.itemStatus);
      }
    });
    //console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^swap item codes are');
    console.log(swapItems);
    //console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^normal items are');
    console.log(items);
    if(req.query.action === 'accept'){
      st = offerDB.updateUserOfferStatus(req.query.itemCode,"Swapped");
      st.then(function(result){
        //req.session.theUserOffers = result;
        res.redirect('../myItems');
      })

    }
    if(req.query.action === 'reject' || req.query.action === 'Withdraw'){
      st = offerDB.deleteOffer(req.query.itemCode);
      st.then(async function(result){
        //req.session.theUserOffers = result;
        await item.updateItem(req.query.itemCode,"Available");
        await item.updateItem(req.query.swapItem,"Available");
        res.redirect('../myItems');
      })
    }
    if(req.query.action === undefined ){
      i = item.getGroupItems(items); ///
      i.then(function(result){
        j = item.getGroupItems(swapItems);
        j.then(function(r){
          console.log(result.length);
          console.log(r.itemName);
          res.render('mySwaps',{items: result, swapItems:r, status:status})
        })
      })
    }
  });
}
});
};

var updateStatus = async function(){
  off = await offerDB.getAllOffers();
  console.log('inside update status');
  off.forEach(async function(individualOffer) {
    up = await item.updateItem(individualOffer.itemCodeOwn, individualOffer.itemStatus);
  });
  return;
}
exports.register= async function(req, res){
  const error = validationResult(req);
  if (!error.isEmpty()) {
    res.render('registration',{errors:error.mapped()});
    return ;
  }
  var password = req.body.password;
  bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
    .then(async function(hashedPassword) {
        //return usersDB.saveUser(username, hashedPassword);
        await userDB.addUser(req.body.userid,req.body.fname,req.body.lname,req.body.email,
                                            hashedPassword,req.body.address1,req.body.address2,req.body.city,
                                            req.body.state,req.body.postCode,  req.body.country);
        req.session.theUser = req.body.userid;
        res.redirect('/myitems')
    })
    .catch(function(error){
            console.log("Error saving user: ");
            console.log(error);
            next();
        });
  }

exports.login= async function(req, res){
  const error = validationResult(req);
  console.log('error is');
  console.log(error.mapped());
  if(!error.isEmpty()){
    res.render('login',{errors:error.mapped(),dberror:""});
    return ;
  }
  var password = req.body.password;
  await userDB.findUser(req.body.email)
    .then(function(user) {
      console.log('***************');
      console.log(user[0].password);
        bcrypt.compare(password, user[0].password)
        .then(function(samePassword) {
            if(!samePassword) {
                res.render('login',{errors:"",dberror:"Invalid username or password"});
            }
            req.session.theUser = user[0].userID;
            res.redirect('/myitems')
        })
    })
    .catch(function(error){
        console.log("Error authenticating user: ");
        console.log(error);
        next();
    });
}
exports.getRate= async function(req, res){

  if(req.session.theUser ==""||req.session.theUser==undefined){
    var err;
    res.render('login',{errors:"",dberror:""});
  }else{
    i = await item.getItem(req.params.itemCode)
    if(i[0].status == "Available"){
      res.render('rate',{item:i[0],ownership:"own"});
    }
    else if(i[0].status == "Swapped"){
      res.render('rate',{item:i[0],ownership:"swap"});
    }
  }
}

exports.postRate= async function(req, res){
  itemCode = req.params.itemCode;

  if(req.session.theUser !=""||req.session.theUser!=undefined){
    if(req.params.ownership=="own"){
      console.log('inside own');
      rating= req.body.ItemRating;
      await item.updateRatingForItem(itemCode,rating);
      res.redirect('/myitems');
    }

  else if(req.params.ownership=="swap" ){
    console.log('inside swap');
    itemRating= req.body.swappedItemRating;
    userRating=req.body.swapOwnerRating;
    const offerDetail= await offerDB.getItemWithItemWantCode(itemCode);
    var swapperDetail = await item.getItem(itemCode);
    feedbackDB.addFeedback(offerDetail._id, req.session.theUser, swapperDetail[0].userID, itemCode, userRating,itemRating);
    res.redirect('/myitems');
  }
  }
  else{
    res.send('No Page Found..May be wrong URL');
  }
}

exports.eachItem= async function(req, res){
  var itemVal = item.getItem(req.params.itemCode);
  //console.log('itemVal');
  //console.log(itemVal);
  var userItem = 0;
  itemVal.then(async function(result){
    itemValues = result[0];
    console.log(itemValues);
    if(itemValues == undefined){
      res.render('categories', {itemsList : "", categoryList : []});
      return;
    }
    console.log(itemValues);
    status = 0;
    if(req.session.theUser != undefined){
      userItems = await item.getUserItems(req.session.theUser);
      userItems.forEach(function(eachItem){
        if(req.params.itemCode == eachItem.itemCode && eachItem.status == "Available" ){
          userItem =1;
        }
        else if(req.params.itemCode == eachItem.itemCode && eachItem.status != "Available" ){
          userItem =2;
        }
      })
      it = offerDB.getOffer(req.session.theUser);
      it.then(function(result){
        result.forEach(function(ii){
          if(ii.itemCodeWant == req.params.itemCode && ii.itemStatus === 'Swapped'){
            console.log('Swapped true');
            status =1;
          }
          if(ii.itemCodeWant== req.params.itemCode && (ii.itemStatus === 'Pending' || ii.itemStatus === 'Offered')){
            status =2;
          }
        });
        if(itemValues !=""){
          //console.log(status);
          res.render('item', {item:itemValues, status:status, userItem:userItem});
        }
      });
    }
    else {
      status = -1;
      res.render('item', {item:itemValues, status:status, userItem:userItem});
    }
  });
}
