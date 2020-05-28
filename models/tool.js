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
            onDelete: 'SET NULL'
        });
    };

    Tool.associate = function(models) {
        Tool.belongsToMany(models.Tag, { through: 'ToolTag', foreignKey: 'ToolId' });
    };

    Tool.prototype.toJSON = function () {
        var values = Object.assign({}, this.get());
        delete values.deletedAt;
        delete values.UserId;
        return values;
    }

    return Tool;
};
