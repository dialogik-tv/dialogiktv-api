const { hashSync, genSaltSync, compareSync } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const db = require ("../../models");

module.exports = {
    getUsers: (req, res) => {
        db.User.findAll().then( (result) => res.json(result) );
    },
    getMe: (req, res) => {
        const owner = req.decoded.result.username;
        db.User.findOne({
            where: {
                username: owner
            }
        }).then( (result) => {
            let data = result.dataValues;

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
    updateUser: (req, res) => {
        const body = req.body;
        const owner = req.decoded.result.username;

        // Hash password if passed
        if(typeof body.password !== 'undefined') {
            const salt = genSaltSync(10);
            body.password = hashSync(body.password, salt);
        }

        // Update user
        db.User.update(body, {
            where: {
                username: owner
            }
        }).then( (result) => {
            result = result[0];

            // In case owner's username does not match any entry in database
            if(result !== 1) {
                return res.status(500).json({
                    error: `Error updating ${owner}`
                })
            }

            // Else
            let message = `User ${owner} successfully updated`;
            return res.json({message: message});
        })
        .catch( (e) => {
            let error = 'Error updating user';
            console.log(error, e);
            return res.status(500).json( {error:error} );
        });
    },
    deleteUser: (req, res) => {
        const owner = req.decoded.result.username;
        db.User.destroy({
            where: {
                username: owner
            }
        }).then( (result) => res.json(result) );
    }
};
