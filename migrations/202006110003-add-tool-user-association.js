module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn(
            'Tool', // Name of Source model
            'UserId', // Name of the key we're adding
            {
                type: Sequelize.UUID,
                references: {
                    model: 'User', // Name of Target model
                    key: 'id', // Key in Target model that we're referencing
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            }
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn(
            'Tool', // Name of Source model
            'UserId' // Key we want to remove
        );
    }
};
