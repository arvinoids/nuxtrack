# Rotation Tracker

This app helps teams manage rotation of tasks/tickets. The app determines the user sequence based on the number of cases each user has been assigned. This ensures that all users get the same amount of work.

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install --shamefully-hoist
```

## Database

This project uses PocketBase as the backend (https://pocketbase.io)
You can import the schema (as of 05/23/2024) called /pb_schema.json to populate the collections.

## Environment file
Please see the .env_example file for the environment variables needed.

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Production

This is a static app, so there is no need to deploy with a server:

```bash
npm run generate
```

If you want to deploy it with nitro, you can also do it, but there is no server-side code:
```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

This is a Nuxt3 app, so yo can check out the Nuxt [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
