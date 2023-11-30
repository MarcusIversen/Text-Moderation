export interface UserDTO {
  id?: number;
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface TextInputDTO {
  userId: number;
  content: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt?: Date;
  step: "1: BadWord" | "2: AIModeration" | "3: ManualModeration";
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