const { hashSync, genSaltSync, compareSync } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const db = require ("../../models");

module.exports = {
    getTools: (req, res) => {
        db.Tool.findAll().then( (result) => res.json(result) );
    },
    createTool: (req, res) => {
        const body = req.body;
        const owner = req.decoded.user.id;

        body.UserId = owner;
        console.log(body);

        db.Tool.create(body)
        .then( (result) => res.json({
            "message": `Tool ${body.title} successfully created`
        }) )
        .catch( (e) => {
            console.log(e);
            return res.status(500).json({
                "error": 'Database error, could not create'
            })
        })
    },
    getToolById: (req, res) => {
        const id = req.params.id;
        db.Tool.findByPk(id).then( (result) => {
            if(!result) {
                return res.status(404).json({
                    message: `No tool found with id ${id}`
                })
            }
            return res.json(result);
        });
    },
    updateTool: (req, res) => {
        const id = req.params.id;
        const body = req.body;
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
                    error: `Error updating ${owner}`
                })
            }

            // Else
            let message = `Tool with id #${id} successfully updated`;
            return res.json({message: message});
        })
        .catch( (e) => {
            let error = `Error updating tool id #${id}`;
            console.log(error, e);
            return res.status(500).json( {error:error} );
        });
    },
    deleteTool: (req, res) => {
        const id = req.params.id;
        const owner = req.decoded.user.id;
        db.Tool.destroy({
            where: {
                id: id,
                UserId: owner
            }
        }).then( (result) => {
            if(result === 0) {
                let error = 'There is no matching item, maybe you\'re not the owner of the item?';
                return res.status(404).json({error:error});
            }
            return res.json({message:`Tool id #${id} successfully deleted`});
        } );
    }
};
