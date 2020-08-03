const { hashSync, genSaltSync, compareSync } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const db = require ("../../models");
const Discord = require('discord.js');

module.exports = {
    register: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        body.status = 0;

        db.User.create(body, { fields: ['username', 'firstname', 'lastname', 'email', 'password', 'status'] })
            .then( (result) => {
                const discord = new Discord.Client();
                discord.login(process.env.DISCORD_TOKEN);
                discord.on('ready', () => {
                    const channel = discord.channels.cache.get('733674475366776943');
                    channel.send(`Neuer User registriert: ${body.username}`);
                });

                return res.json( { message: `User \`${body.username}\` successfully created` } )
            })
            .catch( (e) => {
                // Validation errors
                if(e.name == 'SequelizeValidationError' && typeof e.errors !== 'undefined') {
                    return res.status(422).json({
                        status: 'Form invalid',
                        errors: e.errors
                    });
                }

                return res.status(500).json({
                    error: 'Database error, please try again later or contact tech support'
                });
            });
    },
    login: (req, res) => {
        const body = req.body;
        const invalidMessage = 'Login failed';
        db.User.findOne({
            where: {
                email: body.email,
            }
        }).then(
            (result) => {
                if (!result) {
                    return res.status(401).json({
                        message: invalidMessage
                    });
                }
                const check = compareSync(body.password, result.password);

                if (check) {
                    const data = {
                        id:        result.dataValues.id,
                        username:  result.dataValues.username,
                        firstname: result.dataValues.firstname,
                        lastname:  result.dataValues.lastname,
                        email:     result.dataValues.email,
                        status:    result.dataValues.status,
                        isAdmin:   result.dataValues.isAdmin,
                        createdAt: result.dataValues.createdAt,
                        updatedAt: result.dataValues.updatedAt
                    };
                    const jsonToken = sign({ user: data }, process.env.JWT_SECRET, {
                        expiresIn: '14d'
                    });
                    return res.json({
                        message: 'Login successful',
                        token: jsonToken
                    });
                } else {
                    return res.status(401).json({
                        message: invalidMessage
                    });
                }
            }
        );
    }
};
