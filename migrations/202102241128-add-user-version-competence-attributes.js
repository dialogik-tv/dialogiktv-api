'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn(
                'version_User',
                'competenceSoftware',
                {
                    type: Sequelize.INTEGER(3).UNSIGNED,
                    allowNull: true
                },
            ),
            queryInterface.addColumn(
                'version_User',
                'competenceHardware',
                {
                    type: Sequelize.INTEGER(3).UNSIGNED,
                    allowNull: true
                },
            ),
            queryInterface.addColumn(
                'version_User',
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
                'version_User',
                'competenceSoftware'
            ),
            queryInterface.removeColumn(
                'version_User',
                'competenceHardware'
            ),
            queryInterface.removeColumn(
                'version_User',
                'about'
            )
        ]);
    }
}
