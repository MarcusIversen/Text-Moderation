// src/routes/apiRoutes.ts
import * as express from "express";
import {UserService} from "../services/userService";
import {UserController} from "../controllers/userController";
import {ModerationController} from "../controllers/moderationController";
import {ModerationService} from "../services/moderationService";
import {modelEndpoint} from "../utils/utils";

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
router.get("/moderation/text-log/:textInputId", (req, res) =>
    moderationController.getTextLogOnId(req, res),
);

router.post("/moderation/moderate-text-input", (req, res) =>
    moderationController.processTextInput(req, res),
);

router.put("/moderation/approve-text-input/:textInputId", (req, res) =>
    moderationController.approveTextInput(req, res),
);

router.put("/moderation/reject-text-input/:textInputId", (req, res) =>
    moderationController.rejectTextInput(req, res),
);

router.delete("/moderation/delete-text-input/:textInputId", (req, res) =>
    moderationController.deleteTextInput(req, res),
);


router.get("/moderation/list-of-bad-words", (req, res) =>
    moderationController.getBadWordsList(req, res),
);

router.get("/moderation/moderation-inputs-on-user/:userID", (req, res) =>
    moderationController.getModerationInputsOnUser(req, res),
);

router.get("/moderation/text-input/:textInputId", (req, res) =>
    moderationController.getTextInputOnId(req, res),
);



//AI
router.post(
    "/ai/distilbert",
    modelEndpoint(
        "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english",
    ),
);
router.post(
    "/ai/nsfw",
    modelEndpoint(
        "https://api-inference.huggingface.co/models/michellejieli/inappropriate_text_classifier",
    ),
);
router.post(
    "/ai/moderation",
    modelEndpoint(
        "https://api-inference.huggingface.co/models/KoalaAI/Text-Moderation",
    ),
);
router.post(
    "/ai/contactInfo",
    modelEndpoint(
        "https://api-inference.huggingface.co/models/jakariamd/opp_115_privacy_contact_information",
    ),
);

export default router;
