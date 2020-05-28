'use strict';
module.exports = (sequelize, DataTypes) => {
    // Attributes
    const Tag = sequelize.define('Tag', {
        name: {
            allowNull: false,
            type: DataTypes.STRING
        },
        description: DataTypes.TEXT
    }, {});

    // Associations
    Tag.associate = function(models) {
        Tag.belongsToMany(models.Tool, { through: 'ToolTag' });
    };

    Tag.prototype.toJSON = function () {
        var values = Object.assign({}, this.get());
        delete values.id;
        delete values.deletedAt;
        return values;
    }

    return Tag;
};
