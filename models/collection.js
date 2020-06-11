'use strict';
module.exports = (sequelize, DataTypes) => {
    // Attributes
    const Collection = sequelize.define('Collection', {
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
            unique: true
        },
        description: DataTypes.TEXT
    }, {});

    // Associations
    Collection.associate = function(models) {
        // Tool n:m Collection
        Collection.belongsToMany(models.Tool, { through: 'ToolCollection' });
    };

    // Modify JSON output
    Collection.prototype.toJSON = function () {
        var values = Object.assign({}, this.get());
        delete values.deletedAt;
        return values;
    }

    return Collection;
};
