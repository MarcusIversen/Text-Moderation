import { Request, Response } from 'express';
import {UserService} from "../services/userService";
import {UserDTO} from "../dto/DTOs";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const userIdParam: string | undefined = req.params.userId;

      if (userIdParam === undefined || isNaN(parseInt(userIdParam, 10))) {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
      }

      const userId: number = parseInt(userIdParam, 10);
      const user = await this.userService.getUserById(userId);

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      console.error('Error getting user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }



  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { username, password, email, firstName, lastName }: UserDTO = req.body;

      if (!username || !password || !email || !firstName || !lastName ) {
        res.status(400).json({ error: 'All fields are required' });
        return;
      }

      const insertedId = await this.userService.createUser({ username, password, email, firstName, lastName });

      res.status(201).json({ message: 'User created successfully', insertedId });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userIdParam: string | undefined = req.params.userId;

      const { username, password, email, firstName, lastName }: UserDTO = req.body;

      if (userIdParam === undefined || isNaN(parseInt(userIdParam, 10)) || !username || !password || !firstName || !email || !lastName) {
        res.status(400).json({ error: 'Invalid user data' });
        return;
      }

      const updatedUser = await this.userService.updateUser(Number(userIdParam), { username, password, email, firstName, lastName });

      if (!updatedUser) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json({ message: 'User updated successfully', updatedUser });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userIdParam: string | undefined = req.params.userId;

      if (userIdParam === undefined || isNaN(parseInt(userIdParam, 10))){
        res.status(400).json({ error: 'Invalid user ID' });
        return;
      }

      const deletedUser = await this.userService.getUserById(Number(userIdParam))
      const deleted = await this.userService.deleteUser(Number(userIdParam));

      if (!deleted) {
        res.status(200).json({ message: 'User deleted successfully', deletedUser });
        return;
      }


    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }


  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      const token = await this.userService.login(email, password);

      if (!token) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      res.status(200).json({ token, message: 'Logged in successfully.' });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }


}






