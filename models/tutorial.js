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
                len: [8, 60]
            }
        },
        description: DataTypes.TEXT,
        link: {
            type: DataTypes.STRING,
            validate: {
                isUrl: true
            }
        },
        views: DataTypes.INTEGER,
        status: DataTypes.INTEGER
    }, {
        scopes: {
            published: {
                where: {
                    status: 50
                }
            }
        },
    });

    // Associations
    Tutorial.associate = function(models) {
        // Tutorial n:1 User
        Tutorial.belongsTo(models.User, {
            onUpdate: "CASCADE",
            onDelete: "SET NULL"
        });

        Tutorial.belongsToMany(models.Tool, { through: 'ToolTutorial' });
    };

    // Modify JSON output
    Tutorial.prototype.toJSON = function () {
        const status = {
            '0': 'submitted',
            '20': 'reviewing',
            '50': 'published',
            '-10': 'flagged',
            '-50': 'rejected',
        };
        var values = Object.assign({}, this.get());
        delete values.deletedAt;
        delete values.UserId;
        values.status = {
            code: values.status,
            name: status[values.status]
        };
        return values;
    }

    return Tutorial;
};
