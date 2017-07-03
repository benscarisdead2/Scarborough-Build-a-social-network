'use strict';
module.exports = function(sequelize, DataTypes) {
  var gabs = sequelize.define('gabs', {
    text: DataTypes.STRING
  }, {});

  gabs.associate = function (models) {
  gabs.belongsTo(models.users, {as: 'user', foreignKey: 'userId'});  
  }
  
  return gabs;
};