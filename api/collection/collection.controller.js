const { sign } = require("jsonwebtoken");
const db = require ("../../models");

module.exports = {
    getCollections: (req, res) => {
        db.Collection.findAll({
            include: [
                { model: db.User, attributes: ['username']},
                {
                    model: db.Tool,
                    attributes: ['id', 'title', 'slug', 'status', 'views'],
                    through: { attributes: [] }
                },
            ],
            attributes: ['id', 'title', 'description', 'views', 'createdAt'],
            order: [['views', 'DESC'], [db.Tool, 'title', 'ASC']]
        }).then( (result) => {
            return res.json(result)
        } );
    },
    getCollection: (req, res) => {
        const id = req.params.id;

        db.Collection.findOne({
            where: {
                id: id
            },
            include: [
                { model: db.User, attributes: ['username']},
                {
                    model: db.Tool,
                    attributes: ['id', 'title', 'slug', 'status', 'views'],
                    through: { attributes: [] }
                }
            ],
            order: [[db.Tool, 'title', 'ASC']]
        }).then( (result) => {
            // Increase view counter
            db.Collection.update(
                { views: (result.views + 1) },
                { where: { id: result.id } }
            )
            .then( (updateResult) => res.json(result) )
            // Catch errors but return result anyway
            .catch( (e) => {
                console.log(error, e);
                return res.json(result);
            });
        } );
    },
    createCollection: (req, res) => {
        // Add owner ID to payload
        req.body.UserId = req.decoded.user.id;

        const error = 'Database error, please try again later or contact tech support';
        db.Collection.create(req.body)
            .then( (collection) => {
                return res.json( {
                    message: `Collection \`${req.body.title}\` successfully created`,
                    id: collection.id
                } );
            })
            .catch( (e) => {
                // Validation errors
                if(e.name == 'SequelizeValidationError' && typeof e.errors !== 'undefined') {
                    return res.status(500).json({
                        status: 'Form invalid',
                        errors: e.errors
                    });
                }

                console.log(error, e);
                return res.status(500).json({
                    error: error
                });
            });
    },
    addToolToCollection: (req, res) => {
        // Extract tool ID and collection ID
        const toolId = req.body.tool;
        const collectionId = req.body.collection;

        db.Tool.findByPk(toolId)
        .then( (tool) => {
            if(!tool) {
                return res.status(404).json({
                    message: `No tool found with id ${toolId}`
                });
            }

            db.Collection.findByPk(collectionId)
            .then( (collection) => {
                if(!collection) {
                    return res.status(404).json({
                        message: `No collection found with id ${collectionId}`
                    });
                }

                collection.addTool(tool)
                .then( () => {
                    return res.json({
                        message: `Tool \`${tool.title}\` successfully added to collection \`${collection.title}\``
                    });
                })
                .catch( (e) => {
                    console.log(e);
                    return res.json({ error: 'An error occured. Please try again later.' });
                } );
            });

        });
    },
    removeToolFromCollection: (req, res) => {
        // Extract tool ID and collection ID
        const toolId = req.body.tool;
        const collectionId = req.body.collection;

        db.Tool.findByPk(toolId)
        .then( (tool) => {
            if(!tool) {
                return res.status(404).json({
                    message: `No tool found with id ${toolId}`
                });
            }

            db.Collection.findByPk(collectionId)
            .then( (collection) => {
                if(!collection) {
                    return res.status(404).json({
                        message: `No collection found with id ${collectionId}`
                    });
                }

                collection.removeTool(tool)
                .then( () => {
                    return res.json({
                        message: `Tool \`${tool.title}\` removed added from collection \`${collection.title}\``
                    });
                })
                .catch( (e) => {
                    console.log(e);
                    return res.json({ error: 'An error occured. Please try again later.' });
                } );
            });

        });
    },
    updateCollection: (req, res) => {
        const id      = req.params.id;
        const body    = req.body;
        const owner   = req.decoded.user.id;
        const isAdmin = req.decoded.user.isAdmin;
        const error   = `Error updating tool \`${id}\``;

        if(!isAdmin) {
            console.log(`Unauthorized access attempt by ${owner} to update collection ${id}`);
            return res.status(401).json( { error: error } );
        }

        db.Collection.update(body, {
            where: {
                id: id
            }
        }).then( (result) => {
            const message = `Collection \`${id}\` successfully updated`;
            return res.json( { message: message } );
        })
        .catch( (e) => {
            // Validation errors
            if(e.name == 'SequelizeValidationError' && typeof e.errors !== 'undefined') {
                return res.status(500).json({
                    status: 'Form invalid',
                    errors: e.errors
                });
            }

            console.log(error, e);
            return res.status(500).json( { error: error } );
        });
    },
    deleteCollection: (req, res) => {
        const id      = req.params.id;
        const owner   = req.decoded.user.id;
        const isAdmin = req.decoded.user.isAdmin;

        if(!isAdmin) {
            console.log(`Unauthorized access attempt by ${owner} to delete collection ${id}`);
            return res.status(401).json( { error: error } );
        }

        // Delete User
        db.Collection.destroy({
            where: {
                id: id
            }
        })
        .then( (result) => res.json( { message: `Collection \`${id}\` successfully deleted` } ) )
        .catch( (e) => {
            console.log(error, e);
            return res.status(500).json( { error: error } );
        });
    },
};
