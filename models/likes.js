'use strict';
module.exports = function(sequelize, DataTypes) {
  var likes = sequelize.define('likes', {
    dummy: DataTypes.STRING
  }, {});

  likes.associate = function (models) {
  likes.belongsTo(models.users, {as: 'user', foreignKey: 'userId'});
  likes.belongsTo(models.gabs, {as: 'gabs', foreignKey: 'gabId'});
  }

  return likes;
};
