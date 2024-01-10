# Automated Text-Moderation
<img src="frontend/public/Logo.png" style="display: inline-block; margin: 0 auto; width: 1000px; height: auto;">


## Business Case 

**Information**: In a child-safe application environment, a set of laws have been made by the EU. These laws are set to provide safety for children when they are engaging a child safe online environment. Therefore all User Generated Content (UGC), must be moderated in parallel to the child safety rules. 

**Problem definition**: Up until now, UGC have been moderated manually by an external moderation company. The Customer has by now developed an AI to moderate UGC, which solves the issues of manual moderation, but it has not been implemented yet.  When generating content, you are as a user (child) allowed to insert text to your content, but upon post, then it will manually be moderated by real life employees of the external moderation company.

**Solution**: A mocked system that auto-moderates text. When text is being written, it scans for inappropriate content before it's posted to the application. This time-saving solution prevents moderation costs, shortens time of moderation and therefore enhances user experience. Furthermore it takes a step into automised moderation for UGC in child-safe mobile applications.

## :computer: Product
**Automated Text Moderation** is a web based Text Moderation platform, that utilizes Free Open Source AI to moderate text. The product is developed in Node.js, TypeScript, Express.js, React, Vite, Material UI for React and PostgreSQL with Drizzle ORM.
<br>
<br>
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)


# Setup steps/guide
- **Install Docker Desktop** https://www.docker.com/products/docker-desktop/ (If not already installed)
- **Install Node.js** v.21.4.0 or latest (If not already installed)
- **Install PosgreSQL** v.14.10 - Download here: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
  - Go through setup steps
  - Pick port 5432 to listen on
- **Setup Stackbuilder** (Optional)
  - Pick PostgreSQL 14 on port 5432
  - In database server category - choose category that says (installed)
  - Finish the setup
- In `../Text-Moderation/backend/`
  - Create a **.env** file
  - The syntax should look exactly like this

```
HF_ACCESS_TOKEN=yourhuggingfacetokenhere
SECRET_KEY=hereyouwriteaverysecretkey
```

### HuggingFace Access Token
For the access token, sign up at https://www.hugginface.co/join (Skip inital setup steps if you sign up for the first time)
- Go to your **profile** in right corner
- Press **settings**
- Go to **access tokens**
- Press **new token**
- Call it **kc-text-moderation**
- Pick **"read"** role
- Paste access token into `HF_ACCESS_TOKEN` in the `.env` file

It should look somewhat like this:
```
HF_ACCESS_TOKEN=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
SECRET_KEY=verysecretkey
```

### How to run program: 
1. Go to `/Text-Moderation/frontend` and do following command
```
npm install
```
2. Go to `/Text-Moderation/backend` and do following command
```
npm install
```
3. In `/Text-Moderation/backend` to build, run and stop do following
- Build and run
```
docker compose up --build
```
- Run 
```
docker compose up
```
- Stop
```
docker compose down
```
**All commands may take a while, depending on the performance of your computer**

### Note
- Docker Desktop/Docker Engine has to be running before you can do any compose
- Remember to do `docker compose down` when you don't use the application, otherwise it will run in background.
