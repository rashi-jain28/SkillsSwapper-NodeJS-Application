var express = require('express');
var item = require('../model/itemDB');
var userDB = require('../model/userDB');
var feedbackDB = require('../model/FeedbackDB');
var app = express();
var bodyParser = require('body-parser');
var offerDB = require('../model/offerDB');
var session = require('express-session');
var ProfileController = require(process.cwd()+'/Controller/ProfileController');
var CatalogController = require(process.cwd()+'/Controller/CatalogController');
app.set('view engine', 'ejs');
app.use('/resources', express.static('resources'));
const { check, validationResult} = require('express-validator/check');
var urlencodedParser = bodyParser.urlencoded ({ extended: false });
app.use(session({
  secret: 'this-is-a-secret-token'
}));
app.use(function(req, res, next) {
  res.locals.user = req.session.theUser;
  next();
});


app.get('/index', function(req, res){
  res.render('index');
});
app.get('/', function(req, res){
  res.render('index');
});

app.get('/categories', CatalogController.categories);

app.get('/categories/:catalogCategory',function (req,res) {
  //console.log('insideee');
  var categoryList=[];
  var items = item.getItems();
  items.then(function(result){
    var categories = item.getCategory();
    categories.then(function(cat){
      var categoryList=[];
      if(cat.includes(req.params.catalogCategory)){
        categoryList.push(req.params.catalogCategory);
      }
      res.render('categories', {itemsList : result, categoryList : categoryList});
    });
  });
});

app.get('/item',function (req,res) {
  res.redirect('categories');
});

app.get('/about', function(req,res){
  res.render('about');
});

app.get('/swap/:itemCode', ProfileController.swap);
app.get('/mySwaps', ProfileController.mySwaps );

app.get('/contact', function(req,res){
  res.render('contact');
});

app.get('/item/:itemCode',ProfileController.eachItem);
app.get('/myItems', ProfileController.myItem);

app.get('/signout', function(req, res){
  req.session.theItem = undefined;
  req.session.theUser = undefined;
  res.redirect('login');
});
app.get('/login', function(req, res){
  res.render('login',{errors:"",dberror:""});
});

app.post('/login', urlencodedParser,
check('email').isEmail().withMessage('Please enter valid email ID'),ProfileController.login
);

app.get('/registration', function(req, res){
  res.render('registration',{errors:""});
});
app.post('/registration*',urlencodedParser,
  check('fname','Error').trim().isAlpha().withMessage('Field should have alphabets'),
  check('lname').trim().isAlpha().withMessage('Field should have alphabets'),
//check('email').trim().isEmail(),

  check('email')
    .isEmail().withMessage('Please enter a valid email address')
    .trim()
    .normalizeEmail()
    .custom(value => {
      return userDB.findUserByEmail(value).then(User => {
    //if user email already exists throw an error
  })
}),
  check('userid')
  .trim()
  .custom(value => {
    return userDB.findUserByID(value).then(User => {
    //if user email already exists throw an error
  })
}),
  check('city').trim().matches("[a-zA-Z\s]").withMessage('Field should have alphabets'),
  check('password').isLength({ min: 5 }).withMessage('Password should have minimum length 5'),
  check('state').trim().matches("[a-zA-Z\s]").withMessage('Field should have alphabets'),
  check('postcode').trim().isNumeric().isLength(5).withMessage('Field should have a valid zipcode'),
  check('country').trim().matches("[a-zA-Z\s]").withMessage('Field should have alphabets'),
    ProfileController.register);

app.get('/rate/:itemCode', ProfileController.getRate);
app.post('/rate/:ownership/:itemCode',urlencodedParser,ProfileController.postRate);
app.get('/*', function(req,res){
  res.send('Page Not found');
});

app.listen(8080);
