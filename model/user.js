exports.user = function(userID,firstName,lastName,emailAddress,
  address1,address2,city,state,postCode,country){
  var userItemObj = {
    userID:userID,
    firstName:firstName,
    lastName:lastName,
    emailAddress:emailAddress,
    address1:address1,
    address2:address2,
    city:city,
    state:state,
    postCode:postCode,
    country:country
  }
  return userItemObj;
};
