module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.addColumn(
            'Tool',
            'docLink',
            {
               type: Sequelize.STRING
           },
        );
    },

    down: function(queryInterface, Sequelize) {
        return queryInterface.removeColumn(
            'Tool',
            'docLink'
        );
    }
}
