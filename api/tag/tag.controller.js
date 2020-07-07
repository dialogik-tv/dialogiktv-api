const { sign } = require("jsonwebtoken");
const db = require ("../../models");

module.exports = {
    getTags: (req, res) => {
        db.Tag.findAll({
            include: [
                {
                    model: db.Tool,
                    attributes: ['id', 'title', 'slug', 'status', 'views'],
                    include: [
                        {
                            model: db.User,
                            attributes: ['id', 'username']
                        },
                        {
                            model: db.Tag,
                            attributes: ['name'],
                            through: { attributes: [] }
                        },
                        {
                            model: db.Tutorial,
                            attributes: ['id', 'title', 'status', 'views'],
                            through: { attributes: [] }
                        }
                    ],
                    through: { attributes: [] }
                },
            ],
            attributes: ['id', 'name', 'description', 'views', 'createdAt'],
            // order: [['createdAt', 'DESC'], [db.Tag, 'name', 'ASC']]
        }).then( (result) => {
            result.sort(function compare(a, b) {
                if(a.Tools.length < b.Tools.length) {
                    return 1;
                }
                if(a.Tools.length > b.Tools.length) {
                    return -1;
                }
                return 0;
            });

            return res.json(result)
        } );
    },
    getTag: (req, res) => {
        const tag = req.params.tag;
        db.Tag.findOne({
            where: {
                name: tag
            },
            include: [
                {
                    model: db.Tool,
                    attributes: ['id', 'title', 'slug', 'status', 'views'],
                    include: [
                        {
                            model: db.User,
                            attributes: ['id', 'username']
                        },
                        {
                            model: db.Tag,
                            attributes: ['name'],
                            through: { attributes: [] }
                        },
                        {
                            model: db.Tutorial,
                            attributes: ['id', 'title', 'status', 'views'],
                            through: { attributes: [] }
                        }
                    ],
                    through: { attributes: [] }
                },
            ],
            attributes: ['id', 'name', 'description', 'views'],
            order: [['createdAt', 'DESC'], [db.Tool, 'title', 'ASC'], [db.Tool, db.Tag, 'name', 'ASC'], [db.Tool, db.Tutorial, 'createdAt', 'DESC']]
        }).then( (result) => {
            // Increase view counter
            db.Tag.update(
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
    addToolTag: async (req, res) => {
        const toolId = req.body.tool
        const tagInput = req.body.tag.replace(/[^A-ZÄÖÜa-zäöüß0-9\s]/g, '');
        const error = 'Database error, please try again later or contact tech support';

        if(!tagInput) {
            return res.status(422).json({
                error: 'No input given'
            });
        }

        try {
            const tool = await db.Tool.findByPk(toolId);
            if(!tool) {
                return res.status(404).json({
                    message: `No tool found with id ${toolId}`
                });
            }

            // Add tag to tool
            const [tag, created] = await db.Tag.findOrCreate({ where: { name: tagInput } });
            tool.addTag(tag);
            return res.json( { message: `Tag \`${tag.name}\` successfully added to \`${tool.title}\`` } );
        } catch (e) {
            // Validation errors
            if(e.name == 'SequelizeValidationError' && typeof e.errors !== 'undefined') {
                return res.status(422).json({
                    status: 'Form invalid',
                    errors: e.errors
                });
            } else {
                console.log(error, e);
                return res.status(500).json({
                    error: error
                });
            }
        }
    },
    updateTag: (req, res) => {
        const id      = req.params.id;
        const body    = req.body;
        const owner   = req.decoded.user.id;
        const isAdmin = req.decoded.user.isAdmin;
        const error   = `Error updating tool \`${id}\``;

        if(!isAdmin) {
            console.log(`Unauthorized access attempt by ${owner} to update tag ${id}`);
            return res.status(401).json( { error: error } );
        }

        db.Tag.update(body, { where: { id: id } }).then( (result) => {
            const message = `Tag \`${id}\` successfully updated`;
            return res.json( { message: message } );
        })
        .catch( (e) => {
            // Validation errors
            if(e.name == 'SequelizeValidationError' && typeof e.errors !== 'undefined') {
                return res.status(422).json({
                    status: 'Form invalid',
                    errors: e.errors
                });
            }

            console.log(error, e);
            return res.status(500).json( { error: error } );
        });
    },
    deleteTag: (req, res) => {
        const id      = req.params.id;
        const owner   = req.decoded.user.id;
        const isAdmin = req.decoded.user.isAdmin;

        if(!isAdmin) {
            console.log(`Unauthorized access attempt by ${owner} to delete tag ${id}`);
            return res.status(401).json( { error: error } );
        }

        // Delete User
        db.Tag.destroy({
            where: {
                id: id
            }
        })
        .then( (result) => res.json( { message: `Tag \`${id}\` successfully deleted` } ) )
        .catch( (e) => {
            console.log(error, e);
            return res.status(500).json( { error: error } );
        });
    },
};
