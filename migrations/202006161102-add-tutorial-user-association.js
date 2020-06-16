module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn(
            'Tutorial',
            'UserId',
            {
                type: Sequelize.UUID,
                references: {
                    model: 'User',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            }
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn(
            'Tutorial', // Name of Source model
            'UserId' // Key we want to remove
        );
    }
};
