'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        // Tool belongsToMany Collection (and vice versa)
        return queryInterface.createTable(
            'ToolCollection',
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
                        key: 'id',
                    },
                },
                CollectionId: {
                    type: Sequelize.UUID,
                    primaryKey: true,
                    references: {
                        model: 'Collection',
                        key: 'id',
                    },
                },
            }
        );
    },

    down: (queryInterface, Sequelize) => {
        // Remove table
        return queryInterface.dropTable('ToolCollection');
    },
};
