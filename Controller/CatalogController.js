var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/skillsswapper');
var express = require('express');
var userDB = require('../model/userDB');
var item = require('../model/itemDB');
var app = express();
var session = require('express-session');
app.set('view engine', 'ejs');

app.use(session({
  secret: 'this-is-a-secret-token'
}));

exports.categories  = function(req, res){
  //categoryList=item.getCategory();

  if(req.session.theUser != undefined){
    var differentCategories;
    var items = item.getItems();
    items.then(function(result){
      itemss = result;
      var categories = item.getCategory();
      categories.then(function(cat){
        differentCategories= cat;
        itemsName = [];

        it= item.getUserItems(req.session.theUser);
        it.then(function(rr){
          rr.forEach(function(individualItem){
          itemsName.push(individualItem.itemName);
        });

        newItems = [].concat(
          itemsName.filter(obj1 => itemss.every(obj2 => obj1 !== obj2.itemName)),
          itemss.filter(obj2 => itemsName.every(obj1 => obj2.itemName !== obj1))
        );
        res.render('categories',{itemsList:newItems,categoryList:differentCategories});
      });
      });
    });
  }
  else{
    var differentCategories;
    var items = item.getItems();
    items.then(function(result){
      var categories = item.getCategory();
      categories.then(function(cat){
        differentCategories= cat;
        res.render('categories', {itemsList : result, categoryList : differentCategories});
      });
    });

  }
};
