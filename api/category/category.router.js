const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
    getCategories,
    getCategory,
    createCategory,
    addToolToCategory,
    removeToolFromCategory,
    updateCategory,
    deleteCategory
} = require("./category.controller");

router.get("/categories", getCategories);
router.get("/category/:id", getCategory);
router.post("/category/create", checkToken, createCategory);
router.post("/category/add", checkToken, addToolToCategory);
router.post("/category/remove", checkToken, removeToolFromCategory);
router.patch("/category/edit/:id", checkToken, updateCategory);
router.delete("/category/delete/:id", checkToken, deleteCategory);

module.exports = router;
