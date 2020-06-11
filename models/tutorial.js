'use strict';
module.exports = (sequelize, DataTypes) => {
    // Attributes
    const Tutorial = sequelize.define('Tutorial', {
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
            validate: {
                notEmpty: true,
                len: [8, 40]
            }
        },
        description: DataTypes.TEXT,
        link: {
            type: DataTypes.STRING,
            validate: {
                isUrl: true
            }
        },
    }, {});

    // Associations
    Tutorial.associate = function(models) {
        Tutorial.belongsToMany(models.Tool, { through: 'ToolTutorial' });
    };

    // Modify JSON output
    Tutorial.prototype.toJSON = function () {
        var values = Object.assign({}, this.get());
        delete values.deletedAt;
        return values;
    }

    return Tutorial;
};
