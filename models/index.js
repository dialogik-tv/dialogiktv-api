'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const db = {};

let options = {
    define: {
        // Prevent sequelize from pluralizing table names
        freezeTableName: true,

        // Soft deletion only! (add deletedAt timestamp)
        paranoid: true
    },
    host: process.env.MYSQL_HOST,
    dialect: 'mysql'
}

// Initialize connection
let sequelize;
sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    options
);

// Import user models in this directory
fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });

// Associate db object to models
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

// Export
db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
