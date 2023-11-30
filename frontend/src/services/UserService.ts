import axios from "axios";

interface UserDTO {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  username: string;
}

interface LoginDTO {
  email: string;
  password: string;
}

export class UserService {
  api = axios.create({
    baseURL: `http://localhost:3000/api`,
  });

  register = async (userData: UserDTO) => {
    try {
      const response = await this.api.post('/users/register', userData);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  login = async (credentials: LoginDTO) => {
    try {
      const response = await this.api.post('/users/login', credentials);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}
