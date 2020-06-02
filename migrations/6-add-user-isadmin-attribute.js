module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn(
            'User',
            'isAdmin',
            {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            }
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn(
            'User',
            'isAdmin',
        );
    }
};
