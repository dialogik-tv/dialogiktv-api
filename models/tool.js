'use strict';
module.exports = (sequelize, DataTypes) => {
    // Attributes
    const Tool = sequelize.define('Tool', {
        title: DataTypes.STRING,
        description: DataTypes.TEXT,
        link: DataTypes.TEXT
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
    return Tool;
};
