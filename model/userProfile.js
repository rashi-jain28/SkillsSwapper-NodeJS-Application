userProfile = function(userID,userItems){
  this.userID = userID;
  this.userItems= userItems;
};
userProfile.prototype.removeUserItem = function(item){
  for(var i=0; i < this.userItems.length; i++) {
    if(this.userItems[i].item.itemCode === item) {
        this.userItems.splice(i,1);
      break;
    }
  }
  return this.userItem;
  console.log(this.userItems);
};
userProfile.prototype.getUserItems = function() {
  return this.userItems;
};
exports.emptyProfile = function() {
};
module.exports.userProfile= userProfile;
