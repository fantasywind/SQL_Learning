var Sequelize = require('sequelize');

module.exports = function (sequelize) {
  return sequelize.define('Task', {
    name: Sequelize.STRING,
    finish: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });
}
