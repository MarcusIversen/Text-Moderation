import axios from "axios";

export class ModerationService{
  api = axios.create({
    baseURL: `http://localhost:3000/api`,
  });


  async getAllModerationInputs(userID: string | undefined) {
    try {
      const response = await this.api.get(`/moderation/moderation-inputs-on-user/${userID}`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }




}