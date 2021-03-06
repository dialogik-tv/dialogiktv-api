const { sign } = require("jsonwebtoken");
const db = require ("../../models");
const Discord = require("discord.js");
const { Op } = require("sequelize");

const _ = require("lodash");

module.exports = {
    getTools: (req, res) => {
        const error = 'Database error, could not find tool';
        let filter = req.params.filter;
        if(typeof filter !== 'undefined') {
            filter = JSON.parse(filter);
        } else {
            filter = { "term": "", "category": [], "tag": [] };
        }

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
            where: {
                title: {
                    [Op.like]: `%${filter.term}%`,
                }
            },
            attributes: ['id', 'title', 'description', 'slug', 'docLink', 'vendor', 'vendorLink', 'views', 'status', 'createdAt'],
            order: [['createdAt', 'DESC'], [db.Tag, 'name', 'ASC']]
        }).then( (result) => {
            let counter = 0;

            let categoryFilteredResult = [];
            if(filter.category.length > 0) {
                for(const row of result) {
                    counter = 0;
                    for(const category of row.dataValues.Categories) {
                        if(counter >= filter.category.length) {
                            break;
                        }
                        if(filter.category.indexOf(category.dataValues.id) > -1) {
                            counter++;
                        }
                    }
                    if(counter >= filter.category.length) {
                        categoryFilteredResult.push(row);
                    }
                }
            } else {
                categoryFilteredResult = result;
            }

            let filteredResult = [];
            if(filter.tag.length > 0) {
                for(const row of categoryFilteredResult) {
                    counter = 0;
                    for(const tag of row.dataValues.Tags) {
                        if(counter >= filter.tag.length) {
                            break;
                        }
                        if(filter.tag.indexOf(tag.dataValues.name) > -1) {
                            counter++;
                        }
                    }
                    if(counter >= filter.tag.length) {
                        filteredResult.push(row);
                    }
                }
            } else {
                filteredResult = categoryFilteredResult;
            }

            return res.json(filteredResult);
        } ).catch( (e) => {
            console.log(error, e);
            return res.status(500).json( { error: error } );
        });
    },
    getUnpublishedTools: async (req, res) => {
        const error = 'Database error, could not find tool';
        const isAdmin = req.decoded.user.isAdmin;
        if(!isAdmin) {
            return res.status(403).json( { error: 'You must be Administrator in order to show all unpublished tools!' } );
        }

        try {
            const tools = await db.Tool.scope('unpublished').findAll({
                include: [
                    { model: db.User, attributes: ['id', 'username']}
                ],
                attributes: ['id', 'title', 'description', 'slug', 'docLink', 'vendor', 'vendorLink', 'views', 'status', 'createdAt'],
                order: [['createdAt', 'ASC']]
            });
            return res.json(tools);
        } catch(e) {
            console.log(error, e);
            return res.status(500).json( { error: error } );
        }
    },
    getSimilarTools: (req, res) => {
        const id = req.params.id;
        const error = 'Database error, could not get tool';

        // Fetch tool to be checked for similarity
        db.Tool.findOne({
            where: { id: id },
            include: [
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
            attributes: ['id', 'title'],
            order: [[db.Tag, 'name', 'ASC']]
        }).then( (tool) => {
            if(!tool) {
                return res.status(404).json({
                    message: `No tool found with id ${id}`
                })
            }
            
            // Fetch tools to compare to
            db.Tool.scope('published').findAll({
                include: [
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
                attributes: ['id', 'title', 'description', 'slug'],
                order: [['title', 'ASC'], [db.Tag, 'name', 'ASC']]
            }).then( (toolsToCompare) => {
                let collector = [];

                // Loop over all tags (of root tool)
                for(const tag of tool.dataValues.Tags) {
                    for(const toolToCompare of toolsToCompare) {
                        const currId = toolToCompare.dataValues.id;

                        // Don't compare to self
                        if (id === currId) { continue; }                    

                        // Check if tool is already in result container and add if not
                        const check = _.findIndex(collector, function(c) { return c.tool.id == currId; });
                        if(check < 0) {
                            collector.push({
                                'tool': toolToCompare,
                                sharedTags: [],
                                similarity: 0
                            });
                        }

                        // Loop over all tags and compare, add to result container if appropriate
                        for(const tagToCompare of toolToCompare.dataValues.Tags) {
                            if(tagToCompare.dataValues.name === tag.dataValues.name) {
                                const index = _.findIndex(collector, function(c) { return c.tool.id == currId; });
                                if(index > 0) {
                                    collector[index].sharedTags.push(tag.dataValues.name);
                                    collector[index].similarity++;
                                }
                            }
                        }
                    }
                }

                // Sort by similarity (desc)
                collector.sort((a, b) => {
                    return b.similarity - a.similarity;
                });

                const result = {
                    'tool': tool,
                    'similarTools': collector
                }

                return res.json(result);
            } ).catch( (e) => {
                console.log(error, e);
                return res.status(500).json( { error: error } );
            });
        }).catch( (e) => {
            console.log(error, e);
            return res.status(500).json( { error: error } );
        });
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
        const body     = req.body;
        const owner    = req.decoded.user.id;
        const username = req.decoded.user.username;

        try {
            body.slug = body.title.toLowerCase().replace(/[^A-Za-z0-9 ]/g,'').replace(/ /g,"-")
            const tool = await db.Tool.create(body, {
                fields: ['title', 'description', 'slug', 'link', 'vendor', 'vendorLink', 'docLink']
            });
            tool.slug = tool.slug + '-' + tool.id;
            tool.status = 0;
            tool.UserId = owner;
            await tool.save();
            
            const discord = new Discord.Client();
            discord.login(process.env.DISCORD_TOKEN);
            discord.on('ready', () => {
                const channel = discord.channels.cache.get('733674475366776943');
                const embed = new Discord.MessageEmbed()
                    .setColor('#00acee')
                    .setTitle(`Neues Tool vorgeschlagen: ${tool.title}`)
                    .setDescription(tool.description)
                    .setURL(`https://dialogik.tv/tool/${tool.slug}`)
                    .setTimestamp()
                    .setFooter(`Erstellt von \`${username}\``)

                channel.send(embed);
            });

            return res.json( {
                message: `Tool ${tool.title} successfully submitted, it will be published after review.`,
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

            tool.slug = tool.title.toLowerCase().replace(/[^A-Za-z0-9 ]/g,'').replace(/ /g,"-")
            tool.slug += '-' + tool.id;

            await tool.save();
            const message = `Tool \`${tool.title}\` successfully updated`;
            return res.json({
                message: message,
                slug: tool.slug
            });
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
    publishTool: async (req, res) => {
        const error = 'Database error, could not find tool';

        // Check if user is admin
        const isAdmin = req.decoded.user.isAdmin;
        if(!isAdmin) {
            return res.status(403).json( { error: 'You must be Administrator in order to publish this tool!' } );
        }

        // Parse tool ID
        const id = req.params.id;

        try {
            // Fetch tool
            const tool = await db.Tool.findByPk(id);

            // 404 if not found
            if(!tool) { return res.status(404).json({ error: 'Tool not found' }); }
            
            // Set status to 50 (= publish)
            tool.status = 50;
            await tool.save();

            const message = `Tool \`${tool.title}\` successfully published`;
            return res.json({message: message});
        } catch (e) {
            const error = `Error publishing Tool \`${id}\``;
            console.log(error, e);
            return res.status(500).json( {error:error} );
        }
    },
    rejectTool: async (req, res) => {
        const error = 'Database error, could not find tool';

        // Check if user is admin
        const isAdmin = req.decoded.user.isAdmin;
        if(!isAdmin) {
            return res.status(403).json( { error: 'You must be Administrator in order to reject this tool!' } );
        }

        // Parse tool ID
        const id = req.params.id;

        try {
            // Fetch tool
            const tool = await db.Tool.findByPk(id);

            // 404 if not found
            if(!tool) { return res.status(404).json({ error: 'Tool not found' }); }
            
            // Set status to 50 (= publish)
            tool.status = -50;
            await tool.save();
            const message = `Tool \`${tool.title}\` successfully rejected`;
            return res.json({message: message});
        } catch (e) {
            const error = `Error publishing Tool \`${id}\``;
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
