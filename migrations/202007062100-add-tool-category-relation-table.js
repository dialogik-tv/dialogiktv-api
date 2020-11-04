'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(
            'ToolCategory',
            {
                createdAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                },
                updatedAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                },
                ToolId: {
                    type: Sequelize.UUID,
                    primaryKey: true,
                    references: {
                        model: 'Tool',
                        key: 'id'
                    },
                },
                CategoryId: {
                    type: Sequelize.UUID,
                    primaryKey: true,
                    references: {
                        model: 'Category',
                        key: 'id'
                    },
                },
            }
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('ToolCategory');
    },
};
