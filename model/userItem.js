exports.userItem = function(item,rating,status,swapItem,
  swapItemRating,swapperRating){
  var userItemObj = {
    item:item,
    rating:rating,
    status:status,
    swapItem:swapItem,
    swapItemRating:swapItemRating,
    swapperRating:swapperRating,
  }
  return userItemObj;
};
