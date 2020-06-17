const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
    getCollections,
    getCollection,
    createCollection,
    addToolToCollection,
    updateCollection,
    deleteCollection
} = require("./collection.controller");

router.get("/collections", getCollections);
router.get("/collection/:id", getCollection);
router.post("/collection/create", checkToken, createCollection);
router.post("/collection/add-tool", checkToken, addToolToCollection);
router.patch("/collection/edit/:id", checkToken, updateCollection);
router.delete("/collection/delete/:id", checkToken, deleteCollection);

module.exports = router;
