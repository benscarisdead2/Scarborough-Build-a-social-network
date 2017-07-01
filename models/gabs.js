'use strict';
module.exports = function(sequelize, DataTypes) {
  var gabs = sequelize.define('gabs', {
    text: DataTypes.STRING
  }, {});

  
  return gabs;
};