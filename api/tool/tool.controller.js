const { sign } = require("jsonwebtoken");
const db = require ("../../models");
const Discord = require('discord.js');

module.exports = {
    getTools: (req, res) => {
        db.Tool.scope('published').findAll({
            include: [
                { model: db.User, attributes: ['id', 'username']},
                {
                    model: db.Tag,
                    attributes: ['name'],
                    through: { attributes: [] }
                },
                {
                    model: db.Category,
                    attributes: ['id', 'name', 'views'],
                    through: { attributes: ['relevance'] }
                }
            ],
            attributes: ['id', 'title', 'description', 'slug', 'docLink', 'vendor', 'vendorLink', 'views', 'status', 'createdAt'],
            order: [['title', 'ASC'], [db.Tag, 'name', 'ASC']]
        }).then( (result) => {
            return res.json(result)
        } );
    },
    getToolByIdOrSlug: (req, res) => {
        const slug = req.params.slug;
        const error = 'Database error, could not get tool';
        db.Tool.findOne({
            where: db.Sequelize.or(
                { id: slug },
                { slug: slug }
            ),
            include: [
                { model: db.User, attributes: ['id', 'username']},
                {
                    model: db.Tag,
                    attributes: ['name'],
                    through: { attributes: [] }
                },
                {
                    model: db.Tutorial,
                    attributes: ['id', 'title', 'status', 'views'],
                    through: { attributes: [] }
                },
                {
                    model: db.Category,
                    attributes: ['id', 'name', 'views'],
                    through: { attributes: ['relevance'] }
                }
            ],
            order: [[db.Tag, 'name', 'ASC'], [db.Tutorial, 'createdAt', 'DESC']]
        }).then( (result) => {
            if(!result) {
                return res.status(404).json({
                    message: `No tool found with slug ${slug}`
                })
            }

            // Increase view counter
            db.Tool.update(
                { views: (result.views + 1) },
                { where: { id: result.id } }
            )
            .then( (updateResult) => res.json(result) )
            // Catch errors but return result anyway
            .catch( (e) => {
                console.log(error, e);
                return res.json(result);
            });
        }).catch( (e) => {
            console.log(error, e);
            return res.status(500).json( { error: error } );
        });
    },
    createTool: async (req, res) => {
        const body  = req.body;
        const owner = req.decoded.user.id;

        try {
            body.slug = body.title.toLowerCase().replace(/[^A-Za-z0-9 ]/g,'').replace(/ /g,"-")
            const tool = await db.Tool.create(body, {
                fields: ['title', 'description', 'slug', 'link', 'vendor', 'vendorLink', 'docLink']
            });
            tool.slug = tool.slug + '-' + tool.id;
            tool.status = 50;
            tool.UserId = owner;
            await tool.save();

            const discord = new Discord.Client();
            discord.login(process.env.DISCORD_TOKEN);
            discord.on('ready', () => {
                const channel = discord.channels.cache.get('733674475366776943');
                channel.send(`Neues Tool erstellt! https://dialogik.tv/tool/${tool.slug}`);
            });

            return res.json( {
                message: `Tool ${tool.title} successfully created`,
                slug: tool.slug
            } )
        } catch (e) {
            // Validation errors
            if(e.name == 'SequelizeValidationError' && typeof e.errors !== 'undefined') {
                return res.status(422).json({
                    status: 'Form invalid',
                    errors: e.errors
                });
            }

            const error = 'Database error, could not create';
            console.log(error, e);
            return res.status(500).json({
                "error": error
            })
        }
    },
    updateTool: async (req, res) => {
        const id    = req.params.id;
        const body  = req.body;
        const owner = req.decoded.user.id;

        // Make sure that only specified attributes can be updated
        const allowedKeys = ['title', 'description', 'vendor', 'vendorLink', 'docLink'];
        const usedKeys = Object.keys(body);
        for(const key in usedKeys) {
            if(!allowedKeys.includes(usedKeys[key])) {
                delete body[usedKeys[key]];
            }
        }

        try {
            const tool = await db.Tool.findByPk(id);

            if(!tool) { return res.status(404).json({ error: 'Tool not found' }); }

            if(tool.UserId !== owner) {
                const error = `Unauthorized access attempt by ${owner} to update tool ${id}`;
                console.log(error);
                return res.status(401).json({ error: error });
            }

            for(const [key, val] of Object.entries(req.body)) {
                tool[key] = val;
            }
            await tool.save();
            const message = `Tool \`${tool.title}\` successfully updated`;
            return res.json({message: message});
        } catch (e) {
            // Validation errors
            if(e.name == 'SequelizeValidationError' && typeof e.errors !== 'undefined') {
                return res.status(422).json({
                    status: 'Form invalid',
                    errors: e.errors
                });
            }

            const error = `Error updating Tool \`${id}\``;
            console.log(error, e);
            return res.status(500).json( {error:error} );
        }
    },
    deleteTool: (req, res) => {
        const id    = req.params.id;
        const owner = req.decoded.user.id;

        // Delete User
        db.Tool.destroy({
            where: {
                id: id,
                UserId: owner
            }
        }).then( (result) => {
            if(result === 0) {
                const error = 'There is no matching item, maybe you\'re not the owner of the item?';
                return res.status(404).json( { error: error } );
            }
            return res.json( { message: `Tool \`${id}\` successfully deleted` } );
        } );
    }
};
