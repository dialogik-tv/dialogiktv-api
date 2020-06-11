module.exports = {
    up: (queryInterface, Sequelize) => {
        // Tool belongsToMany Tutorial (and vice versa)
        return queryInterface.createTable(
            'ToolTutorial',
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
                TutorialId: {
                    type: Sequelize.UUID,
                    primaryKey: true,
                    references: {
                        model: 'Tutorial',
                        key: 'id'
                    },
                },
            }
        );
    },

    down: (queryInterface, Sequelize) => {
        // Remove table
        return queryInterface.dropTable('ToolTutorial');
    },
};
