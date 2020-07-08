'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn(
                'Tool',
                'status',
                {
                   type: Sequelize.INTEGER(3),
                   defaultValue: 50,
                   allowNull: false
                },
            ),
            queryInterface.changeColumn(
                'Tutorial',
                'status',
                {
                   type: Sequelize.INTEGER(3),
                   defaultValue: 50,
                   allowNull: false
                },
            )
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn(
                'Tool',
                'status',
                {
                   type: Sequelize.INTEGER(3),
                   defaultValue: 0,
                   allowNull: false
                },
            ),
            queryInterface.changeColumn(
                'Tutorial',
                'status',
                {
                   type: Sequelize.INTEGER(3),
                   defaultValue: 0,
                   allowNull: false
                },
            )
        ]);
    }
}
