'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn(
            'version_User',
            'competenceValidated',
            {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn(
            'version_User',
            'competenceValidated'
        );
    }
}