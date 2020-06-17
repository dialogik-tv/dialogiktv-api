const { sign } = require("jsonwebtoken");
const db = require ("../../models");

module.exports = {
    getTools: (req, res) => {
        db.Tool.scope('published').findAll({
            include: [
                { model: db.User, attributes: ['username']},
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
            attributes: ['id', 'title', 'description', 'slug', 'docLink', 'vendor', 'vendorLink', 'views', 'status', 'createdAt'],
            order: [['createdAt', 'DESC'], [db.Tag, 'name', 'ASC'], [db.Tutorial, 'title', 'ASC']]
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
                { model: db.User, attributes: ['username']},
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
    createTool: (req, res) => {
        const body  = req.body;
        const owner = req.decoded.user.id;

        let suffix = ''
        while (suffix.length < 12) {
            suffix += Math.random().toString(36).replace(/[^A-Za-z0-9]+/g, '');
        }

        body.UserId = owner;
        body.slug = body.title.toLowerCase().replace(/[^A-Za-z0-9\s!?]/g,'').replace(/ /g,"-");
        body.slug = body.slug + '-' + suffix;

        db.Tool.create(body)
            .then( (result) => res.json( {
                message: `Tool ${body.title} successfully created`,
                slug: body.slug
            } ) )
            .catch( (e) => {
                // Validation errors
                if(e.name == 'SequelizeValidationError' && typeof e.errors !== 'undefined') {
                    return res.status(500).json({
                        status: 'Form invalid',
                        errors: e.errors
                    });
                }

                const error = 'Database error, could not create';
                console.log(error, e);
                return res.status(500).json({
                    "error": error
                })
            });
    },
    updateTool: (req, res) => {
        const id    = req.params.id;
        const body  = req.body;
        const owner = req.decoded.user.id;
        const error = `Error updating tool \`${id}\``;

        // Make sure that only specified attributes can be updated
        // (e.g. users shall not be able to update views or status)
        const allowedKeys = ['title', 'description', 'vendor', 'vendorLink', 'docLink'];
        const usedKeys = Object.keys(body);
        for(const key in usedKeys) {
            if(!allowedKeys.includes(usedKeys[key])) {
                delete body[usedKeys[key]];
            }
        }

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
                    error: error
                })
            }

            const message = `Tool \`${id}\` successfully updated`;
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
