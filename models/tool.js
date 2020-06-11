'use strict';
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
        views: DataTypes.INTEGER
    }, {});

    // Associations
    Tool.associate = function(models) {
        // Tool n:1 User
        Tool.belongsTo(models.User, {
            onUpdate: "CASCADE",
            onDelete: "SET NULL"
        });

        // Tool n:m Tag
        Tool.belongsToMany(models.Tag, { through: 'ToolTag' });

        // Tool n:m Collection
        Tool.belongsToMany(models.Collection, { through: 'ToolCollection' });

        // Tool n:m Tutorial
        Tool.belongsToMany(models.Tutorial, { through: 'ToolTutorial' });
    };

    // Modify JSON output
    Tool.prototype.toJSON = function () {
        var values = Object.assign({}, this.get());
        delete values.deletedAt;
        delete values.UserId;
        return values;
    }

    return Tool;
};
