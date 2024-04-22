# Local deployment Helmet webapp

## Setup environment variables backend

Change `.env.sample` in `/webapp/api` to the correct values. For local development, you do not need to change them, just copy the file and rename to `.env`

### Setup environment variables frontend

Change `.env.sample` in `/webapp/client` to the correct values. For local development, you do not need to change them, just copy the file and rename to `.env`

### Run Nodejs backend

Make sure you have NodeJS installed. Also make sure you have a mongoDB server ready (either locally or in the cloud). It is adviced to install this via `brew` when using a mac. You might need to start the MongoDB server using `brew services start mongodb-community@7.0`

To run the backend, first, go to the corresponding folder;

```console
cd webapp/api
```

Then install all packages using;

```console
npm install
```

Deploy using

```console
npx nodemon server.js
```

### Run NextJS development server for frontend

For the frontend, also make sure to be in the correct folder.

```console
cd webapp/client
```

Then install all packages using;

```console
npm install
```

Deploy using

```console
npm run dev
```
