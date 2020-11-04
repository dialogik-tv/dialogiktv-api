'use strict';
module.exports = {

    /* ********************************
    // TODO: How to automatically use model definition
    // let models = require('../Models/index');
    //
    // module.exports = {
    //  up: function (queryInterface, Sequelize) {
    //    return Promise.resolve()
    //      .then(() => {
    //        return queryInterface.createTable(models.projects.tableName,
    //          models.projects.attributes, models.projects.options);
    //      });
    ******************************** */

    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('User', {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
                autoIncrement: false
            },
            username: {
                allowNull: false,
                type: Sequelize.STRING,
                unique: true
            },
            firstname: Sequelize.STRING,
            lastname: Sequelize.STRING,
            email: {
                allowNull: false,
                type: Sequelize.STRING,
                unique: true
            },
            password: {
                allowNull: false,
                type: Sequelize.STRING
            },
            status: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            deletedAt: {
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('User');
    }
};
