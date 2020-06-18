'use strict';

const Version = require('sequelize-version');

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
            unique: true,
            validate: {
                isAlphanumeric: true,
                notNull: true,
                notEmpty: true,
                len: [4, 24],
            }
        },
        firstname: {
            type: DataTypes.STRING,
            // validate: {
            //     isAlphanumeric: true
            // }
        },
        lastname: {
            type: DataTypes.STRING,
            // validate: {
            //     isAlphanumeric: true
            // }
        },
        email: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            allowNull: false,
            type: DataTypes.STRING
        },
        status: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        isAdmin: {
            allowNull: false,
            defaultValue: false,
            type: DataTypes.BOOLEAN
        }
    }, {
        scopes: {}
    });

    // Version
    const versionOptions = {
        prefix: '',
        suffix: 'Log',
        // attributePrefix: 'revision',
        // schema: 'audit',
        //attributes to ignore from origin model
        exclude: ['createdAt', 'updatedAt', 'deletedAt', 'password'],
        tableUnderscored: false,
        underscored: false
    }
    const UserLog = new Version(User, versionOptions);

    // Associations
    User.associate = function(models) {
        User.hasMany(models.Tool);
        User.hasMany(models.Tutorial);
        User.hasMany(models.Collection);
    };

    // Modify JSON output
    User.prototype.toJSON = function () {
        var values = Object.assign({}, this.get());
        delete values.password;
        delete values.email;
        delete values.deletedAt;
        return values;
    }

    return User;
};
