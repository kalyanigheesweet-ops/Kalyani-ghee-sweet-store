# Kalyani Sweet Store

Implement exactly the screenshot and nothing else

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Authentication setup

Authentication is handled by Firebase Authentication. Copy `.env.example` to `.env.local` and set:

```sh
VITE_FIREBASE_API_KEY=your-web-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-web-app-id
```

In the Firebase console, enable Email/Password and Google under Authentication > Sign-in method, then add your deployed domain under Authentication > Settings > Authorized domains. These web config values are public identifiers; never add Firebase Admin credentials or service-account keys to this frontend or commit `.env.local`.
