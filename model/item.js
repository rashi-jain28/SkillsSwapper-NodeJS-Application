var item = function(itemCode,itemName,name,category, description,rating, imageURL){
  var itemObj = {
    itemCode:itemCode,
    itemName:itemName,
    name:name,
    category:category,
    description:description,
    rating:rating,
    imageURL:imageURL
  }
  return itemObj;
};
module.exports.item = item;
