'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn(
                'Tag',
                'views',
                {
                   type: Sequelize.INTEGER.UNSIGNED,
                   defaultValue: 0,
                   allowNull: false
               },
            ),
            queryInterface.addColumn(
                'Collection',
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
                'Tag',
                'views'
            ),
            queryInterface.removeColumn(
                'Collection',
                'views'
            )
        ]);
    }
}
