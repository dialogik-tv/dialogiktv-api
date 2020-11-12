'use strict';
module.exports = (sequelize, DataTypes) => {
    // Attributes
    const Tag = sequelize.define('Tag', {
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
            unique: true,
            validate: {
                is: /^[a-z\d\s]+$/i,
                notEmpty: true,
                len: [3, 32]
            }
        },
        description: DataTypes.TEXT,
        views: DataTypes.INTEGER.UNSIGNED
    }, {});

    // Associations
    Tag.associate = function(models) {
        Tag.belongsToMany(models.Tool, { through: 'ToolTag' });
        Tag.belongsToMany(models.Tool, { through: 'ToolTag' });
    };

    // Modify JSON output
    Tag.prototype.toJSON = function () {
        var values = Object.assign({}, this.get());
        delete values.deletedAt;
        return values;
    }

    return Tag;
};
