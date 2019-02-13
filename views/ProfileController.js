var express = require('express');
var userDB = require('../model/userDB');
var userProfile = require('../model/userProfile');
var item = require('../model/itemDB');
var offerDB = require('../model/offerDB');
var app = express();
var session = require('express-session');
app.set('view engine', 'ejs');
var currentUser = 'rjain12';

app.use(session({
  secret: 'this-is-a-secret-token'
}));

exports.myItem  = function(req, res){
  var updated = false;
  finalItems =[];
  if(req.session.theUser === undefined){

    it = item.getUserItems(currentUser);
    it.then(function(result){
      result.forEach(function(individualResult){
        if(individualResult.status === 'Available' || individualResult.status === 'Pending'
        || individualResult.status === 'Offered'){
          finalItems.push(individualResult)
        }
      });
      req.session.theUser = currentUser;
      res.render('myItems',{items: result});
    });
  }
  else {
    //console.log("--------------before update");
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
      userP = offerDB.getOffer(currentUser);
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
        i = item.getGroupItems(items); ///
        i.then(function(result){
          j = item.getGroupItems(swapItems);
          j.then(function(r){
            //console.log(result.length);
            //console.log(r.itemName);
            res.render('mySwaps',{items: result, swapItems:r, status:status})
          })
        })
      });
        //console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^swap item codes are');
        //console.
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
          //console.log('---------------- inside undefined');
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
