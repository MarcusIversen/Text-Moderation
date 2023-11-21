export interface UserDTO {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface TextInputDTO {
  id?: number;
  userId: number;
  content?: string;
  status?: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt?: Date;
  step?: "BadWord" | "AIModeration" | "ManualModeration";
  wordListScore?: number;
  personalIdentifiableInfoScore?: number;
  nsfwScore?: number;
  distilbertScore?: number;
}

export interface LogDTO {
  id?: number;
  textInputId: number;
  type?: "badWord" | "PersonalInfo" | "negative" | "nsfw" | "hate" | "threatening" | "violence" | "racism";
  createdAt?: Date;
  updatedAt?: Date;
}