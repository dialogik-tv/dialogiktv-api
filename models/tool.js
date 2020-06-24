'use strict';

const Version = require('sequelize-version');

module.exports = (sequelize, DataTypes) => {
    // Attributes
    const Tool = sequelize.define('Tool', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            autoIncrement: false
        },
        title: {
            allowNull: false,
            type: DataTypes.STRING,
            validate: {
                notEmpty: true,
                len: [3, 40]
            }
        },
        slug: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true
        },
        description: DataTypes.TEXT,
        link: {
            type: DataTypes.STRING,
            validate: {
                isUrl: true
            }
        },
        docLink: {
            type: DataTypes.STRING,
            validate: {
                isUrl: true
            }
        },
        vendor: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: true,
                len: [2, 40]
            }
        },
        vendorLink: {
            type: DataTypes.STRING,
            validate: {
                isUrl: true
            }
        },
        views: DataTypes.INTEGER.UNSIGNED,
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 50
        }
    }, {
        scopes: {
            published: {
                where: {
                    status: 50
                }
            }
        },
    });

    // Associations
    Tool.associate = function(models) {
        Tool.belongsTo(models.User, {
            onUpdate: "CASCADE",
            onDelete: "SET NULL"
        });

        Tool.belongsToMany(models.Tag, { through: 'ToolTag' });
        Tool.belongsToMany(models.Collection, { through: 'ToolCollection' });
        Tool.belongsToMany(models.Tutorial, { through: 'ToolTutorial' });
    };

    // Version
    const versionOptions = {
        exclude: ['createdAt', 'updatedAt', 'deletedAt', 'views']
    }
    const ToolLog = new Version(Tool, versionOptions);

    // Modify JSON output
    Tool.prototype.toJSON = function () {
        const status = {
            '0': 'submitted',
            '20': 'reviewing',
            '50': 'published',
            '-10': 'flagged',
            '-50': 'rejected',
        };
        var values = Object.assign({}, this.get());
        delete values.deletedAt;
        delete values.UserId;
        const old = values.status;
        values.status = {
            code: old,
            name: status[old]
        };
        return values;
    }

    return Tool;
};
