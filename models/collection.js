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
        title: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true,
            validate: {
                notEmpty: true,
                len: [3, 40]
            }
        },
        description: DataTypes.TEXT,
        views: DataTypes.INTEGER.UNSIGNED
    }, {});

    // Associations
    Collection.associate = function(models) {
        Collection.belongsTo(models.User, {
            onUpdate: "CASCADE",
            onDelete: "SET NULL"
        });

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
