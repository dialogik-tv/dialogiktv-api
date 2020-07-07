'use strict';

module.exports = (sequelize, DataTypes) => {
    // Attributes
    const ToolCategory = sequelize.define('ToolCategory', {
        relevance: {
            type: DataTypes.FLOAT(5, 4),
            defaultValue: 0,
            validate: {
                isFloat: true,
                len: [0, 1]
            }
        }
    }, {
        paranoid: false
    });

    return ToolCategory;
};
