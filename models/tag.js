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
            type: DataTypes.STRING
        },
        description: DataTypes.TEXT
    }, {});

    // Associations
    Tag.associate = function(models) {
        Tag.belongsToMany(models.Tool, { through: 'ToolTag', foreignKey: 'ToolId' });
    };

    // Modify JSON output
    Tag.prototype.toJSON = function () {
        var values = Object.assign({}, this.get());
        delete values.deletedAt;
        return values;
    }

    return Tag;
};
