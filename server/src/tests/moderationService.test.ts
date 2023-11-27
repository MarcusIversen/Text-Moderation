import { describe, expect, it } from "vitest";
import { ModerationService } from "../services/moderationService";
import postgres from "postgres";
import { CONNECTION_STRING } from "../config/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { textInput } from "../db/schema";
import { eq } from "drizzle-orm";

describe("ModerationService", () => {
  const moderationService = new ModerationService();
  const sql = postgres(CONNECTION_STRING, { max: 2 });
  const db = drizzle(sql);

  it("should insert a textInput into db, with the initial values", async () => {
    const userId = 4;
    const inputs = "Hi this is a textinput for testing purposes";

    const result = await moderationService.createTextInput(userId, inputs);

    // Use get to verify if the data is correct
    const retrievedData = await db
      .select()
      .from(textInput)
      .where(eq(textInput.userId, userId))
      .execute();

    console.log(retrievedData[0]);

    expect(retrievedData[0]).toEqual({
      textInput: inputs,
      id: result.id,
      userId: userId,
    });
  });
});
