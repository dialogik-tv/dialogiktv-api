'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.createTable('version_Collection', {
                id: {
                    type: Sequelize.UUID,
                    defaultValue: Sequelize.UUIDV4,
                    allowNull: true,
                    autoIncrement: false
                },
                title: Sequelize.STRING,
                description: Sequelize.TEXT,
                version_id: {
                    allowNull: false,
                    primaryKey: true,
                    type: Sequelize.BIGINT(20),
                    autoIncrement: true
                },
                version_type: {
                    allowNull: false,
                    type: Sequelize.INTEGER
                },
                version_timestamp: {
                    allowNull: false,
                    type: Sequelize.DATE
                }
            }),
            queryInterface.createTable('version_Tool', {
                id: {
                    type: Sequelize.UUID,
                    defaultValue: Sequelize.UUIDV4,
                    allowNull: true,
                    autoIncrement: false
                },
                title: Sequelize.STRING,
                slug: Sequelize.STRING,
                description: Sequelize.TEXT,
                link: Sequelize.STRING,
                docLink: Sequelize.STRING,
                vendor: Sequelize.STRING,
                vendorLink: Sequelize.STRING,
                status: Sequelize.INTEGER,
                version_id: {
                    allowNull: false,
                    primaryKey: true,
                    type: Sequelize.BIGINT(20),
                    autoIncrement: true
                },
                version_type: {
                    allowNull: false,
                    type: Sequelize.INTEGER
                },
                version_timestamp: {
                    allowNull: false,
                    type: Sequelize.DATE
                }
            }),
            queryInterface.createTable('version_Tutorial', {
                id: {
                    type: Sequelize.UUID,
                    defaultValue: Sequelize.UUIDV4,
                    allowNull: true,
                    autoIncrement: false
                },
                title: Sequelize.STRING,
                description: Sequelize.TEXT,
                link: Sequelize.STRING,
                status: Sequelize.INTEGER,
                version_id: {
                    allowNull: false,
                    primaryKey: true,
                    type: Sequelize.BIGINT(20),
                    autoIncrement: true
                },
                version_type: {
                    allowNull: false,
                    type: Sequelize.INTEGER
                },
                version_timestamp: {
                    allowNull: false,
                    type: Sequelize.DATE
                }
            }),
            queryInterface.createTable('version_User', {
                id: {
                    type: Sequelize.UUID,
                    defaultValue: Sequelize.UUIDV4,
                    allowNull: true,
                    autoIncrement: false
                },
                username: Sequelize.STRING,
                firstname: Sequelize.STRING,
                lastname: Sequelize.STRING,
                email: Sequelize.STRING,
                status: Sequelize.INTEGER,
                isAdmin: Sequelize.TINYINT(1),
                version_id: {
                    allowNull: false,
                    primaryKey: true,
                    type: Sequelize.BIGINT(20),
                    autoIncrement: true
                },
                version_type: {
                    allowNull: false,
                    type: Sequelize.INTEGER
                },
                version_timestamp: {
                    allowNull: false,
                    type: Sequelize.DATE
                }
            }),
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.dropTable('version_Collection'),
            queryInterface.dropTable('version_Tool'),
            queryInterface.dropTable('version_Tutorial'),
            queryInterface.dropTable('version_User'),
        ]);
    }
}
