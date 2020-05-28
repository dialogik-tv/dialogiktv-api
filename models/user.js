'use strict';
module.exports = (sequelize, DataTypes) => {
    // Attributes
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            autoIncrement: false
        },
        username: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true
        },
        firstname: DataTypes.STRING,
        lastname: DataTypes.STRING,
        email: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true
        },
        password: {
            allowNull: false,
            type: DataTypes.STRING
        },
        status: {
            allowNull: false,
            type: DataTypes.INTEGER
        }
    }, {
        scopes: {}
    });

    // Associations
    User.associate = function(models) {
        User.hasMany(models.Tool);
    };

    User.prototype.toJSON = function () {
        var values = Object.assign({}, this.get());
        delete values.password;
        delete values.email;
        delete values.deletedAt;
        return values;
    }

    return User;
};
