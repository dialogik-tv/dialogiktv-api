module.exports = {
    up: (queryInterface, Sequelize) => {
        // Tool belongsToMany Tag (and vice versa)
        return queryInterface.createTable(
            'ToolTag',
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
                TagId: {
                    type: Sequelize.UUID,
                    primaryKey: true,
                    references: {
                        model: 'Tag',
                        key: 'id'
                    },
                },
            }
        );
    },

    down: (queryInterface, Sequelize) => {
        // Remove table
        return queryInterface.dropTable('ToolTag');
    },
};
