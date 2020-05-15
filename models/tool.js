'use strict';
module.exports = (sequelize, DataTypes) => {
    const Tool = sequelize.define('Tool', {
        title: DataTypes.STRING
    }, {});
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
