'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn(
            'Tool',
            'docLink',
            {
               type: Sequelize.STRING
           },
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn(
            'Tool',
            'docLink'
        );
    }
}
