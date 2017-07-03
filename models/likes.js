'use strict';
module.exports = function(sequelize, DataTypes) {
  var likes = sequelize.define('likes', {
    dummy: DataTypes.STRING
  }, {});


  
  return likes;
};