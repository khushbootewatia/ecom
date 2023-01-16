const express = require('express');
const router = express.Router();
const controller = require('./admin.controller')

//******************************ADMIN LOGIN********************************//
router.post('/login', controller.loginAdmin);

//******************************USER CRUD********************************//
router.get("/getAllUser", controller.getAllUser);
router.get("/getOneUser", controller.getOneUser);
router.delete("/deleteUser", controller.deleteUser);

//******************************SELLER CRUD********************************//
router.get("/getAllSeller",controller.getAllSeller);
router.get("/getOneSeller",controller.getOneSeller);
router.delete("/deleteSeller/:", controller.deleteUser);

module.exports = router;
