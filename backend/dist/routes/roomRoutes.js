"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roomController_1 = require("../controllers/roomController");
const router = (0, express_1.Router)();
router.get('/questions/categories', roomController_1.RoomController.getCategories);
router.get('/questions/sample', roomController_1.RoomController.getSampleQuestions);
exports.default = router;
