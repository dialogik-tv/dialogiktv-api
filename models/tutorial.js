'use strict';

const Version = require('sequelize-version');

module.exports = (sequelize, DataTypes) => {
    // Attributes
    const Tutorial = sequelize.define('Tutorial', {
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
                len: [8, 120]
            }
        },
        description: DataTypes.TEXT,
        link: {
            type: DataTypes.STRING,
            validate: {
                isUrl: true
            }
        },
        views: DataTypes.INTEGER.UNSIGNED,
        status:  {
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
    Tutorial.associate = function(models) {
        Tutorial.belongsTo(models.User, {
            onUpdate: "CASCADE",
            onDelete: "SET NULL"
        });

        Tutorial.belongsToMany(models.Tool, { through: 'ToolTutorial' });
    };

    // Version
    const versionOptions = {
        exclude: ['createdAt', 'updatedAt', 'deletedAt', 'views']
    }
    const TutorialLog = new Version(Tutorial, versionOptions);

    // Modify JSON output
    Tutorial.prototype.toJSON = function () {
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

    return Tutorial;
};
