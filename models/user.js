'use strict';

const { Op } = require("sequelize");
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
                is: /^[A-Za-zÀ-ž0-9\u0370-\u03FF\u0400-\u04FF]*$/,
                notNull: true,
                notEmpty: true,
                len: [4, 24],
            }
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [2, 30]
            }
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [2, 40]
            }
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
        },
        twitchChannel: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: true
        },
        competenceSoftware: {
            allowNull: true,
            type: DataTypes.INTEGER(3),
            validate: {
                min: 0,
                max: 100
            }
        },
        competenceHardware: {
            allowNull: true,
            type: DataTypes.INTEGER(3),
            validate: {
                min: 0,
                max: 100
            }
        },
        competenceValidated: {
            allowNull: false,
            defaultValue: false,
            type: DataTypes.BOOLEAN
        },
        about: {
            allowNull: true,
            type: DataTypes.TEXT
        }
    }, {
        scopes: {
            engineers: {
                where: {
                    [Op.and]: [
                        {
                            competenceSoftware: {
                                [Op.gte]: 0
                            },
                            competenceHardware: {
                                [Op.gte]: 0
                            },
                            competenceValidated: true
                        }
                    ]
                }
            }
        }
    });

    // Associations
    User.associate = function(models) {
        User.hasMany(models.Tool);
        User.hasMany(models.Tutorial);
        User.hasMany(models.Collection);
    };

    // Version
    const versionOptions = {
        exclude: ['createdAt', 'updatedAt', 'deletedAt', 'password']
    }
    const UserLog = new Version(User, versionOptions);

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
