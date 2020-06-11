const { sign } = require("jsonwebtoken");
const db = require ("../../models");

module.exports = {
    getTutorials: (req, res) => {
        db.Tutorial.findAll({
            include: [
                {
                    model: db.Tool,
                    attributes: ['id', 'title', 'slug'],
                    through: { attributes: [] }
                },
            ],
            order: [['createdAt', 'DESC'], [db.Tool, 'title', 'ASC']]
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
    getTutorial: (req, res) => {
        const id = req.params.id;
        db.Tutorial.findByPk(id).then( (result) => {
            return res.json(result);
        } );
    },
    updateTutorial: (req, res) => {
        const id      = req.params.id;
        const body    = req.body;
        const owner   = req.decoded.user.id;
        const isAdmin = req.decoded.user.isAdmin;
        const error   = `Error updating tool \`${id}\``;

        if(!isAdmin) {
            console.log(`Unauthorized access attempt by ${owner} to update tutorial ${id}`);
            return res.status(401).json( { error: error } );
        }

        db.Tutorial.update(body, {
            where: {
                id: id
            }
        }).then( (result) => {
            const message = `Tutorial \`${id}\` successfully updated`;
            return res.json( { message: message } );
        })
        .catch( (e) => {
            // Validation errors
            if(typeof e.errors !== 'undefined' && e.name == 'SequelizeValidationError') {
                return res.status(500).json({
                    error: 'Form invalid'
                });
            }

            console.log(error, e);
            return res.status(500).json( { error: error } );
        });
    },
    deleteTutorial: (req, res) => {
        const id      = req.params.id;
        const owner   = req.decoded.user.id;
        const isAdmin = req.decoded.user.isAdmin;

        if(!isAdmin) {
            console.log(`Unauthorized access attempt by ${owner} to delete tutorial ${id}`);
            return res.status(401).json( { error: error } );
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
            return res.status(500).json( { error: error } );
        });
    },
    addToolTutorial: (req, res) => {
        const toolId = req.body.tool;

        delete req.body.tool;
        const tutorialInput = req.body;
        console.log(tutorialInput);

        db.Tool.findByPk(toolId)
            .then( (tool) => {
                if(!tool) {
                    return res.status(404).json({
                        message: `No tool found with id ${toolId}`
                    });
                }

                const error = 'Database error, please try again later or contact tech support';
                db.Tutorial.create(tutorialInput)
                    .then( (newTutorial) => {
                        // Add tag to tool
                        tool.addTutorial(newTutorial);
                        return res.json( { message: `Tutorial \`${tutorialInput.title}\` successfully added to \`${tool.title}\`` } );
                    })
                    .catch( (e) => {
                        // Validation errors
                        if(typeof e.errors !== 'undefined' && e.name == 'SequelizeValidationError') {
                            return res.status(500).json({
                                error: 'Form invalid'
                            });
                        }

                        console.log(error, e);
                        return res.status(500).json({
                            error: error
                        });
                    });
            });
    },
};
