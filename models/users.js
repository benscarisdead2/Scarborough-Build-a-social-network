'use strict';
module.exports = function(sequelize, DataTypes) {
  var users = sequelize.define('users', {
    name: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});

  users.associate = function (models) {
  users.hasMany(models.gabs, {as: 'gabs', foreignKey: 'userId'});
  users.hasMany(models.likes, {as: 'likes', foreignKey: 'userId'});    
  }

  return users;
};
