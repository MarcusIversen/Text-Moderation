import axios from "axios";

export class ModerationService {
    api = axios.create({
        baseURL: `http://localhost:3000/api`,
    });


    async getAllModerationInputs(userID: string | undefined) {
        try {
            const response = await this.api.get(`/moderation/moderation-inputs-on-user/${userID}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getTextInputById(textInputId: string | undefined) {
        try {
            const response = await this.api.get(`/moderation/text-input/${textInputId}`);
            return response.data[0];
        } catch (error) {
            throw error;
        }
    }

    async getTextLogById(textInputId: string | undefined) {
        try {
            const response = await this.api.get(`/moderation/text-log/${textInputId}`);
            return response.data[0];
        } catch (error) {
            throw error;
        }
    }

    async createAndProcessTextInput(userId: string | undefined, content: string) {
        try {
            const response = await this.api.post(`/moderation/moderate-text-input`, {userId, content});
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async aiConnectionTest() {
        const testString = "This is a test string, which is supposed to start up the ai connection test and it should be really long to really start up the slow hugginface API's";
        const distilbert = await this.api.post(`/ai/distilbert`, {inputs: testString});
        const nsfw = await this.api.post(`/ai/nsfw`, {inputs: testString});
        const contactInfo = await this.api.post(`/ai/contactInfo`, {inputs: testString});
        const moderation = await this.api.post(`/ai/moderation`, {inputs: testString});

        return await Promise.all([distilbert, nsfw, contactInfo, moderation]);
    }

    async approveTextInput(textInputId: string | undefined, moderationTags: string) {
        try {
            const response = await this.api.put(`/moderation/approve-text-input/${textInputId}`, {moderationTags: moderationTags});
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async rejectTextInput(textInputId: string | undefined, moderationTags: string | undefined) {
        try {
            const response = await this.api.put(`/moderation/reject-text-input/${textInputId}`, {moderationTags: moderationTags});
            return response.data;
        } catch (error) {
            throw error;
        }
    }


}