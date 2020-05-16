'use strict';
module.exports = (sequelize, DataTypes) => {
    // Attributes
    const Tool = sequelize.define('Tool', {
        title: {
            allowNull: false,
            type: DataTypes.STRING
        },
        slug: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true
        },
        description: DataTypes.TEXT,
        link: DataTypes.STRING
    }, {});

    // Associations
    Tool.associate = function(models) {
        Tool.belongsTo(models.User, {
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: false
            }
        });
    };

    Tool.prototype.toJSON = function () {
        var values = Object.assign({}, this.get());
        delete values.id;
        delete values.deletedAt;
        return values;
    }

    return Tool;
};
