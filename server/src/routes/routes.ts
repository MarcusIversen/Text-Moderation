// src/routes/routes.ts
import express from "express";
import { UserService } from "../services/userService";
import { UserController } from "../controllers/userController";
import { ModerationController } from "../controllers/moderationController";
import { ModerationService } from "../services/moderationService";
import { modelEndpoint } from "../utils/utils";

const router = express.Router();

const userService = new UserService();
const moderationService = new ModerationService();

const moderationController = new ModerationController(moderationService);
const userController = new UserController(userService);

//User
router.post("/users/register", (req, res) =>
  userController.createUser(req, res),
);
router.post("/users/login", (req, res) => userController.login(req, res));
router.get("/users/get/:userId", (req, res) =>
  userController.getUser(req, res),
);
router.put("/users/update/:userId", (req, res) =>
  userController.updateUser(req, res),
);
router.delete("/users/delete/:userId", (req, res) =>
  userController.deleteUser(req, res),
);

//Moderation
router.post("/moderation/moderate-text-input", (req, res) =>
  moderationController.processTextInput(req, res),
);
router.post("/moderation/bad-words-check", (req, res) =>
  moderationController.badWordCheck(req, res),
);
router.get("/moderation/list-of-bad-words", (req, res) =>
  moderationController.getBadWordsList(req, res),
);

//AI Routes
router.post(
  "/api/distilbert",
  modelEndpoint(
    "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english",
  ),
);
router.post(
  "/api/nsfw",
  modelEndpoint(
    "https://api-inference.huggingface.co/models/michellejieli/inappropriate_text_classifier",
  ),
);
router.post(
  "/api/moderation",
  modelEndpoint(
    "https://api-inference.huggingface.co/models/KoalaAI/Text-Moderation",
  ),
);
router.post(
  "/api/contactInfo",
  modelEndpoint(
    "https://api-inference.huggingface.co/models/jakariamd/opp_115_privacy_contact_information",
  ),
);

export default router;
