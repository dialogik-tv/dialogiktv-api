'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn(
                'User',
                'competenceSoftware',
                {
                    type: Sequelize.INTEGER(3).UNSIGNED,
                    allowNull: true
                },
            ),
            queryInterface.addColumn(
                'User',
                'competenceHardware',
                {
                    type: Sequelize.INTEGER(3).UNSIGNED,
                    allowNull: true
                },
            ),
            queryInterface.addColumn(
                'User',
                'about',
                {
                    type: Sequelize.TEXT,
                    allowNull: true
                },
            )
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn(
                'User',
                'competenceSoftware'
            ),
            queryInterface.removeColumn(
                'User',
                'competenceHardware'
            ),
            queryInterface.removeColumn(
                'User',
                'about'
            )
        ]);
    }
}
