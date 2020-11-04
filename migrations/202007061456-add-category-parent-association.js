'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn(
            'Category',
            'ParentId',
            {
                type: Sequelize.UUID,
                references: {
                    model: 'Category',
                    key: 'id',
                }
            }
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn(
            'Category',
            'ParentId'
        );
    }
};
