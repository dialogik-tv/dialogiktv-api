'use strict';

module.exports = (sequelize, DataTypes) => {
    // Attributes
    const Category = sequelize.define('Category', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            autoIncrement: false
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING,
            validate: {
                notEmpty: true,
                len: [8, 60]
            }
        },
        description: DataTypes.TEXT,
        views: DataTypes.INTEGER.UNSIGNED
    }, {});

    // Associations
    Category.associate = function(models) {
        Category.hasMany(models.Category, {
            as: 'children',
            foreignKey: 'ParentId'
        });
        Category.belongsTo(models.Category, {
            as: 'parent',
            foreignKey: 'ParentId'
        });

        Category.belongsToMany(models.Tool, { through: 'ToolCategory' });
    };

    // Modify JSON output
    Category.prototype.toJSON = function () {
        var values = Object.assign({}, this.get());
        delete values.deletedAt;
        delete values.ParentId;
        return values;
    }

    return Category;
};
