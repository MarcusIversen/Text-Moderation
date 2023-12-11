import { user } from "../db/schema";
import { UserDTO } from "../dto/DTOs";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db/setup";

export class UserService {
  async getUserById(userId: number): Promise<UserDTO | null> {
    const result = await db.select().from(user).where(eq(user.id, userId));

    return result[0] || null;
  }

  async createUser(userDTO: UserDTO): Promise<number | undefined> {
    const hashedPassword = await bcrypt.hash(userDTO.password, 10);
    const result = await db
      .insert(user)
      .values({ ...userDTO, password: hashedPassword, createdAt: new Date() })
      .returning({ insertedId: user.id });

    return result[0]?.insertedId;
  }

  async updateUser(userId: number, userDTO: UserDTO): Promise<UserDTO | null> {
    const hashedPassword = await bcrypt.hash(userDTO.password, 10);
    // Update the user
    await db
      .update(user)
      .set({ ...userDTO, password: hashedPassword, updatedAt: new Date() })
      .where(eq(user.id, userId))
      .execute();

    // Fetch the updated user
    const updatedUserResult = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .execute();

    return updatedUserResult[0] || null;
  }

  async deleteUser(userId: number): Promise<UserDTO | null> {
    const result = await db.delete(user).where(eq(user.id, userId)).execute();

    return result[0] || null;
  }

  async generateToken(user: UserDTO): Promise<string> {
    const secretKey = process.env.SECRET_KEY;

    if (!secretKey) {
      throw new Error("Missing secret key");
    }

    const payload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    return jwt.sign(payload, secretKey, { expiresIn: "7d" });
  }

  async login(email: string, password: string): Promise<string | null> {
    const result = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .execute();

    const selectedUser = result[0];

    if (!selectedUser) {
      return null;
    }

    const passwordMatch = await bcrypt.compare(password, selectedUser.password);

    if (!passwordMatch) {
      return null;
    }

    return this.generateToken(selectedUser);
  }
}
