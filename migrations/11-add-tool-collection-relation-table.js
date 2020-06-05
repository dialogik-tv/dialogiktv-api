module.exports = {
    up: (queryInterface, Sequelize) => {
        // Tool belongsToMany Tutorial (and vice versa)
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
                },
                CollectionId: {
                    type: Sequelize.UUID,
                    primaryKey: true,
                },
            }
        );
    },

    down: (queryInterface, Sequelize) => {
        // Remove table
        return queryInterface.dropTable('ToolCollection');
    },
};
