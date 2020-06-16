'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn(
            'Tool',
            'views',
            {
               type: Sequelize.INTEGER.UNSIGNED,
               defaultValue: 0,
               allowNull: false
           },
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn(
            'Tool',
            'views'
        );
    }
}
