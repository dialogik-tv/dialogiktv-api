const { sign } = require("jsonwebtoken");
const db = require ("../../models");

module.exports = {
    getCategories: async (req, res) => {
        try {
            const categories = await db.Category.findAll({
                where: {
                    ParentId: null
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
                            }
                        ],
                        through: { attributes: ['relevance'] }
                    },
                ],
                attributes: ['id', 'name', 'description', 'views', 'createdAt'],
                // order: [['views', 'DESC'], [db.Tool, 'title', 'ASC']]
                order: [['createdAt', 'DESC']]
            });
            return res.json(categories);
        } catch (e) {
            console.log('Error', e);
            return res.status(500).json({error: 'Error'});
        }
    },
    getCategory: async (req, res) => {
        const id = req.params.id;
        const error = 'Database error, please try again later or contact tech support';

        try {
            const category = await db.Category.findByPk(id, {
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
                        through: { attributes: ['relevance'] }
                    },
                ],
                attributes: ['id', 'name', 'description', 'views', 'createdAt']
            });
            if(!category) {
                return res.status(404).json({
                    message: `No category found with id ${id}`
                });
            }

            // Increase view counter
            category.views++;
            await category.save();

            return res.json(category);
        } catch(e) {
            console.log(error, e);
            return res.status(500).json( { error: error } );
        }
    },
    createCategory: async (req, res) => {
        const owner   = req.decoded.user.id;
        const isAdmin = req.decoded.user.isAdmin;
        let error = 'Database error, please try again later or contact tech support';

        if(!isAdmin) {
            error = `Unauthorized category creation attempt by ${owner}`
            console.log(error);
            return res.status(401).json( { error: error } );
        }

        try {
            const category = await db.Category.create(req.body, { fields: ['name', 'description'] });
            return res.json( {
                message: `Category \`${category.name}\` successfully created`,
                id: category.id
            } );
        } catch (e) {
            // Validation errors
            if(e.name == 'SequelizeValidationError' && typeof e.errors !== 'undefined') {
                return res.status(422).json({
                    status: 'Form invalid',
                    errors: e.errors
                });
            }

            console.log(error, e);
            return res.status(500).json({
                error: error
            });
        }
    },
    addToolToCategory: async (req, res) => {
        // Extract tool ID and category ID
        const toolId = req.body.tool;
        const categoryId = req.body.category;
        const relevance = req.body.relevance;

        try {
            const tool = await db.Tool.findByPk(toolId);
            if(!tool) {
                return res.status(404).json({
                    message: `No tool found with id ${toolId}`
                });
            }

            const category = await db.Category.findByPk(categoryId)
            if(!category) {
                return res.status(404).json({
                    message: `No category found with id ${categoryId}`
                });
            }

            if(typeof relevance != 'undefined') {
                await category.addTool(tool, { through: { relevance: relevance }});
            } else {
                await category.addTool(tool);
            }
            return res.json({
                message: `Tool \`${tool.title}\` successfully added to category \`${category.name}\``
            });
        } catch (e) {
            console.log(e);
            return res.json({ error: 'An error occured. Please try again later.' });
        }
    },
    removeToolFromCategory: async (req, res) => {
        // Extract tool ID and category ID
        const toolId = req.body.tool;
        const categoryId = req.body.category;

        try {
            const tool = await db.Tool.findByPk(toolId);
            if(!tool) {
                return res.status(404).json({
                    message: `No tool found with id ${toolId}`
                });
            }

            const category = await db.Category.findByPk(categoryId);
            if(!category) {
                return res.status(404).json({
                    message: `No category found with id ${categoryId}`
                });
            }

            await category.removeTool(tool);
            return res.json({
                message: `Tool \`${tool.title}\` removed from category \`${category.name}\``
            });
        } catch (e) {
            console.log(e);
            return res.json({ error: 'An error occured. Please try again later.' });
        }
    },
    updateCategory: async (req, res) => {
        const id      = req.params.id;
        const body    = req.body;
        const owner   = req.decoded.user.id;
        const isAdmin = req.decoded.user.isAdmin;

        if(!isAdmin) {
            console.log(`Unauthorized access attempt by ${owner} to update tag ${id}`);
            return res.status(401).json( { error: error } );
        }

        // Make sure that only specified attributes can be updated
        const allowedKeys = ['name', 'description'];
        const usedKeys = Object.keys(body);
        for(const key in usedKeys) {
            if(!allowedKeys.includes(usedKeys[key])) {
                delete body[usedKeys[key]];
            }
        }

        try {
            const category = await db.Category.findByPk(id);

            if(!category) { return res.status(404).json({ error: 'Category not found' }); }

            for(const [key, val] of Object.entries(body)) {
                category[key] = val;
                console.log(`Key \`${key}\` set to \`${val}\``);
            }
            await category.save();
            const message = `Category \`${category.name}\` successfully updated`;
            return res.json({message: message});
        } catch (e) {
            // Validation errors
            if(e.name == 'SequelizeValidationError' && typeof e.errors !== 'undefined') {
                return res.status(422).json({
                    status: 'Form invalid',
                    errors: e.errors
                });
            }

            const error = `Error updating Category \`${id}\``;
            console.log(error, e);
            return res.status(500).json( {error:error} );
        }
    },
    deleteCategory: (req, res) => {
        const id      = req.params.id;
        const owner   = req.decoded.user.id;
        const isAdmin = req.decoded.user.isAdmin;

        if(!isAdmin) {
            console.log(`Unauthorized access attempt by ${owner} to delete category ${id}`);
            return res.status(401).json( { error: error } );
        }

        // Delete User
        db.Category.destroy({
            where: {
                id: id
            }
        })
        .then( (result) => res.json( { message: `Category \`${id}\` successfully deleted` } ) )
        .catch( (e) => {
            console.log(error, e);
            return res.status(500).json( { error: error } );
        });
    },
};
