'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'likes',
      'gabId',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'gabs',
          key: 'id'
        }
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn(
      'likes',
      'gabID'
    )
  }
};
