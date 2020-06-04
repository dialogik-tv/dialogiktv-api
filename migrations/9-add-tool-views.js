module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.addColumn(
            'Tool',
            'views',
            {
               type: Sequelize.INTEGER,
               defaultValue: 0,
               allowNull: false
           },
        );
    },

    down: function(queryInterface, Sequelize) {
        return queryInterface.removeColumn(
            'Tool',
            'views'
        );
    }
}
