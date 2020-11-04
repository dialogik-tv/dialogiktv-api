'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn(
            'ToolCategory',
            'relevance',
            {
                type: Sequelize.FLOAT(5, 4)
            },
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn(
            'ToolCategory',
            'relevance'
        );
    }
}
