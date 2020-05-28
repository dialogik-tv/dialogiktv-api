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
        link: DataTypes.STRING,
        vendor: DataTypes.STRING,
        vendorLink: DataTypes.STRING
    }, {});

    // Associations
    Tool.associate = function(models) {
        Tool.belongsTo(models.User, {
            onUpdate: 'CASCADE',
            onDelete: "SET NULL"
        });
    };

    Tool.associate = function(models) {
        Tool.belongsToMany(models.Tag, { through: 'ToolTag' });
    };

    Tool.prototype.toJSON = function () {
        var values = Object.assign({}, this.get());
        delete values.id;
        delete values.deletedAt;
        delete values.UserId;
        return values;
    }

    return Tool;
};
