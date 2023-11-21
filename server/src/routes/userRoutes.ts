// src/routes/userRoutes.ts
import express from 'express';
import {UserService} from "../services/userService";
import {UserController} from "../controllers/userController";
import {ModerationController} from "../controllers/moderationController";
import {WordModerationService} from "../services/wordModerationService";

const router = express.Router();

const userService = new UserService();
const wordModerationService = new WordModerationService();

const moderationController = new ModerationController(wordModerationService);
const userController = new UserController(userService);

//User
router.post('/users/register', (req, res) => userController.createUser(req, res));
router.post('/users/login', (req, res) => userController.login(req, res));
router.get('/users/get/:userId', (req, res) => userController.getUser(req, res));
router.put('/users/update/:userId', (req, res) => userController.updateUser(req, res));
router.delete('/users/delete/:userId', (req, res) => userController.deleteUser(req, res));


//Moderation
router.post('/moderation/bad-words-check', (req, res) => moderationController.badWordCheck(req, res));
router.get('/moderation/list-of-bad-words', (req, res) => moderationController.getBadWordsList(req,res))


export default router;
