const { sign } = require("jsonwebtoken");
const db = require ("../../models");

module.exports = {
    getTutorials: (req, res) => {
        db.Tutorial.scope('published').findAll({
            include: [
                { model: db.User, attributes: ['username']},
                {
                    model: db.Tool,
                    attributes: ['id', 'title', 'slug', 'status', 'views'],
                    through: { attributes: [] }
                },
            ],
            order: [['createdAt', 'DESC'], [db.Tool, 'title', 'ASC']]
        }).then( (result) => {
            return res.json(result)
        });
    },
    getTutorial: (req, res) => {
        const id = req.params.id;

        db.Tutorial.findOne({
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
            db.Tutorial.update(
                { views: (result.views + 1) },
                { where: { id: result.id } }
            )
            .then( (updateResult) => res.json(result) )
            // Catch errors but return result anyway
            .catch( (e) => {
                console.log(error, e);
                return res.json(result);
            });
        });
    },
    addToolTutorial: (req, res) => {
        // Extract tool ID and remove from payload
        const toolId = req.body.tool;
        delete req.body.tool;

        // Add owner ID to payload
        req.body.UserId = req.decoded.user.id;

        // Find according tool
        db.Tool.findByPk(toolId)
            .then( (tool) => {
                if(!tool) {
                    return res.status(404).json({
                        message: `No tool found with id ${toolId}`
                    });
                }

                const error = 'Database error, please try again later or contact tech support';
                db.Tutorial.create(req.body)
                    .then( (newTutorial) => {
                        // Add tag to tool
                        tool.addTutorial(newTutorial);
                        return res.json( {
                            message: `Tutorial \`${req.body.title}\` successfully added to \`${tool.title}\``,
                            id: newTutorial.id
                        });
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
            });
    },
    updateTutorial: async (req, res) => {
        const id      = req.params.id;
        const body    = req.body;
        const owner   = req.decoded.user.id;

        // Make sure that only specified attributes can be updated
        const allowedKeys = ['title', 'description', 'link'];
        const usedKeys = Object.keys(body);
        for(const key in usedKeys) {
            if(!allowedKeys.includes(usedKeys[key])) {
                delete body[usedKeys[key]];
            }
        }

        try {
            const tutorial = await db.Tutorial.findByPk(id);

            if(!tutorial) { return res.status(404).json({ error: 'Tutorial not found' }); }

            if(tutorial.UserId !== owner) {
                const error = `Unauthorized access attempt by ${owner} to update tutorial ${id}`;
                console.log(error);
                return res.status(401).json({ error: error });
            }

            for(const [key, val] of Object.entries(req.body)) {
                tutorial[key] = val;
            }
            tutorial.save();
            const message = `Tutorial \`${tutorial.title}\` successfully updated`;
            return res.json({message: message});
        } catch (e) {
            // Validation errors
            if(e.name == 'SequelizeValidationError' && typeof e.errors !== 'undefined') {
                return res.status(500).json({
                    status: 'Form invalid',
                    errors: e.errors
                });
            }

            const error = `Error updating Tutorial \`${id}\``;
            console.log(error, e);
            return res.status(500).json( {error:error} );
        }
    },
    deleteTutorial: (req, res) => {
        const id      = req.params.id;
        const owner   = req.decoded.user.id;
        const isAdmin = req.decoded.user.isAdmin;

        if(!isAdmin) {
            console.log(`Unauthorized access attempt by ${owner} to delete tutorial ${id}`);
            return res.status(401).json({ error: error });
        }

        // Delete User
        db.Tutorial.destroy({
            where: {
                id: id
            }
        })
        .then( (result) => res.json( { message: `Tutorial \`${id}\` successfully deleted` } ) )
        .catch( (e) => {
            console.log(error, e);
            return res.status(500).json({ error: error });
        });
    },
};
