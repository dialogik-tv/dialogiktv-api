const { hashSync, genSaltSync } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const db = require ("../../models");
const { Op } = require("sequelize");

module.exports = {
    getUsers: (req, res) => {
        db.User.findAll().then( (result) => res.json(result) );
    },
    getEngineers: (req, res) => {
        db.User.scope('engineers').findAll({
            attributes: ['username', 'twitchChannel', 'competenceSoftware', 'competenceHardware', 'about']
        }).then( (result) => res.json(result) );
    },
    getMe: (req, res) => {
        const owner = req.decoded.user.id;
        db.User.findOne({
            where: {
                id: owner
            }
        }).then( (result) => {
            const data = result.dataValues;

            // Don't show password or deletedAt
            delete data.password;
            delete data.deletedAt;
            return res.json(data);
        })
    },
    getUserByUserId: (req, res) => {
        const id = req.params.id;
        db.User.findByPk(id).then( (result) => {
            if(!result) {
                return res.status(404).json({
                    message: `No user found with id ${id}`
                })
            }
            return res.json(result);
        });
    },
    getUserByUsername: (req, res) => {
        const username = req.params.username;
        db.User.findOne({
            where: {
                username: username,
            }
        }).then( (result) => {
            if(!result) {
                return res.status(404).json({
                    message: `No user found with username ${username}`
                })
            }
            return res.json(result);
        });
    },
    updateUser: async (req, res) => {
        const body = req.body;
        const owner = req.decoded.user.id;
        const username = req.decoded.user.username;

        // Make sure that only specified attributes can be updated
        // (e.g. users shall not be able to update status or isAdmin)
        const allowedKeys = ['firstname', 'lastname', 'email', 'password', 'competenceSoftware', 'competenceHardware', 'about'];
        const usedKeys = Object.keys(body);

        for(const key in usedKeys) {
            if(!allowedKeys.includes(usedKeys[key])) {
                delete body[usedKeys[key]];
            }
        }

        // Hash password if passed
        if(typeof body.password !== 'undefined') {
            const salt = genSaltSync(10);
            body.password = hashSync(body.password, salt);
        }

        // Cast competence values to integers
        if(typeof body.competenceSoftware == 'string') {
            body.competenceSoftware = parseInt(body.competenceSoftware);
        }
        if(typeof body.competenceHardware == 'string') {
            body.competenceHardware = parseInt(body.competenceHardware);
        }

        try {
            const user = await db.User.findByPk(owner);
            for(const [key, val] of Object.entries(req.body)) {
                user[key] = val;
            }

            await user.save();
            const message = `User ${username} successfully updated`;
            return res.json({message: message});
        } catch (e) {
            // Validation errors
            if(e.name == 'SequelizeValidationError' && typeof e.errors !== 'undefined') {
                return res.status(422).json({
                    status: 'Form invalid',
                    errors: e.errors
                });
            }

            const error = `Error updating user ${username}`;
            console.log(error, e);
            return res.status(500).json( {error:error} );
        }
    },
    deleteUser: (req, res) => {
        const owner = req.decoded.user.id;
        db.User.destroy({
            where: {
                id: owner
            }
        }).then( (result) => res.json(result) );
    }
};
