// src/routes/userRoutes.ts
import express from 'express';
import {UserService} from "../services/userService";
import {UserController} from "../controllers/userController";

const router = express.Router();

const userService = new UserService();
const userController = new UserController(userService);

router.post('/users/register', (req, res) => userController.createUser(req, res));
router.post('/users/login', (req, res) => userController.login(req, res));
router.get('/users/:userId', (req, res) => userController.getUser(req, res));
router.put('/users/update/:userId', (req, res) => userController.updateUser(req, res));
router.delete('/users/delete/:userId', (req, res) => userController.deleteUser(req, res));

export default router;
