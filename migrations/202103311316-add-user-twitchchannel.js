'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn(
                'User',
                'twitchChannel',
                {
                    type: Sequelize.STRING,
                    unique: true,
                    allowNull: true
                },
            ),
            queryInterface.addColumn(
                'version_User',
                'twitchChannel',
                {
                    type: Sequelize.STRING,
                    unique: true,
                    allowNull: true
                },
            )
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn(
                'User',
                'twitchChannel'
            ),
            queryInterface.removeColumn(
                'version_User',
                'twitchChannel'
            )
        ]);
    }
}
