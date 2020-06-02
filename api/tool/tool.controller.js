const { sign } = require("jsonwebtoken");
const db = require ("../../models");

module.exports = {
    getTools: (req, res) => {
        db.Tool.findAll({
            include: [
                { model: db.User, attributes: ['username']},
                {
                    model: db.Tag,
                    attributes: ['name'],
                    through: { attributes: [] }
                },
            ],
            attributes: ['id', 'title', 'description', 'slug', 'vendor', 'vendorLink'],
            order: [['createdAt', 'DESC']]
        }).then( (result) => {
            return res.json(result)
        } );
    },
    getToolsByTag: (req, res) => {
        const tag = req.params.tag;
        db.Tag.findOne({
            where: {
                name: tag
            },
            include: [
                {
                    model: db.Tool,
                    include: [
                        {
                            model: db.User,
                            attributes: ['username']
                        },
                        {
                            model: db.Tag,
                            attributes: ['name'],
                            through: { attributes: [] }
                        }
                    ],
                    through: { attributes: [] }
                },
            ],
        }).then( (result) => {
            return res.json(result);
        } );
    },
    createTool: (req, res) => {
        const body = req.body;
        const owner = req.decoded.user.id;

        let suffix = ''
        while (suffix.length < 24) {
            suffix += Math.random().toString(36).replace(/[^A-Za-z0-9]+/g, '').substr(0, 5);
        }

        body.UserId = owner;
        body.slug = body.title.toLowerCase().replace(/[^A-Za-z0-9\s!?]/g,'').replace(/ /g,"-");
        body.slug = body.slug + '-' + suffix;

        db.Tool.create(body)
            .then( (result) => res.json( { message: `Tool ${body.title} successfully created` } ) )
            .catch( (e) => {
                const error = 'Database error, could not create';
                console.log(error, e);
                return res.status(500).json({
                    "error": error
                })
            });
    },
    getToolBySlug: (req, res) => {
        const slug = req.params.slug;
        db.Tool.findOne({
            where: {
                slug: slug
            },
            include: [
                { model: db.User, attributes: ['username']},
                {
                    model: db.Tag,
                    attributes: ['name'],
                    through: { attributes: [] }
                },
            ]
        }).then( (result) => {
            if(!result) {
                return res.status(404).json({
                    message: `No tool found with slug ${slug}`
                })
            }
            return res.json(result);
        })
    },
    updateTool: (req, res) => {
        const id    = req.params.id;
        const body  = req.body;
        const owner = req.decoded.user.id;

        // Update user
        db.Tool.update(body, {
            where: {
                id: id,
                UserId: owner
            }
        }).then( (result) => {
            // In case owner's id does not match any entry in database
            result = result[0];
            if(result !== 1) {
                return res.status(500).json({
                    error: `Error updating tool \`${id}\``
                })
            }

            const message = `Tool \`${id}\` successfully updated`;
            return res.json( { message: message } );
        })
        .catch( (e) => {
            const error = `Error updating tool \`${id}\``;
            console.log(error, e);
            return res.status(500).json( { error: error } );
        });
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
    },
    addTag: (req, res) => {
        const toolId = req.body.id;
        // const owner  = req.decoded.user.id;
        const tagInput = req.body.tag.replace(/[^A-Za-z0-9\s]/g,'');
        // Replace blank spaces by dashes: .replace(/ /g,"-")

        db.Tool.findByPk(toolId)
            .then( (tool) => {
                if(!tool) {
                    return res.status(404).json({
                        message: `No tool found with id ${toolId}`
                    });
                }

                const error = 'Database error, please try again later or contact tech support';
                db.Tag.create( { name: tagInput } )
                    .then( (newTag) => {
                        // Add tag to tool
                        tool.addTag(newTag);
                        return res.json( { message: `Tag \`${tagInput}\` successfully added to \`${tool.title}\`` } );
                    })
                    .catch( (e) => {
                        // Tag already exists, but let's create association
                        if(e.original.code == 'ER_DUP_ENTRY') {
                            db.Tag.findOne( { where: { name: tagInput } } )
                                .then( (tag) => {
                                    try {
                                        // Add tag to tool
                                        // (sequelize automatically handles already existing
                                        // associations via a pre processed SELECT query)
                                        tool.addTag(tag);
                                        return res.json( { message: `Tag \`${tagInput}\` successfully added to \`${tool.title}\`` } );
                                    } catch (e) {
                                        console.log(error, e);
                                        return res.status(500).json({
                                            error: error
                                        });
                                    }
                                });
                        } else {
                            console.log(error, e);
                            return res.status(500).json({
                                error: error
                            });
                        }
                    });
            });
    },
};
