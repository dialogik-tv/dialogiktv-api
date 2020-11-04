'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn(
                'Tool',
                'status',
                {
                   type: Sequelize.INTEGER(3),
                   defaultValue: 0,
                   allowNull: false
               },
            ),
            queryInterface.addColumn(
                'Tutorial',
                'status',
                {
                   type: Sequelize.INTEGER(3),
                   defaultValue: 0,
                   allowNull: false
               },
            ),
            queryInterface.addColumn(
                'Tutorial',
                'views',
                {
                   type: Sequelize.INTEGER.UNSIGNED,
                   defaultValue: 0,
                   allowNull: false
               },
            )
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn(
                'Tool',
                'status'
            ),
            queryInterface.removeColumn(
                'Tutorial',
                'status'
            ),
            queryInterface.removeColumn(
                'Tutorial',
                'views'
            )
        ]);
    }
}
