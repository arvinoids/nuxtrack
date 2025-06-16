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
You can import the schema called ./pb_schema.json to create the collections.

Next to the pocketbase executable, create a `pb_hooks` folder and create a file called `hook.pb.js` with the content:
``` javascript
/// <reference path="../pb_data/types.d.ts" />

onRecordAfterUpdateRequest((e) => {
    // Only run for the counter collection
    if (e.collection.name !== "counter") return;

    // Get the record
    const record = e.record;

    // Update total_cases as sum of count and archived
    record.set("total_count", (record.get("count") || 0) + (record.get("archived") || 0));

    // Save the record
    $app.dao().saveRecord(record);
});
```
This hook will update the total_count column in the collection whenever the count and archived columns are updated.

If there are existing records that need to be updated, run this hook:
``` javascript
onAfterBootstrap(() => {
    const records = $app.dao().findRecordsByFilter("counter", "id != ''");
    
    for (const record of records) {
        const count = record.getInt("count") || 0;
        const archived = record.getInt("archived") || 0;
        record.set("total_count", count + archived);
        $app.dao().saveRecord(record);
    }
    
    console.log(`Updated ${records.length} counter records`);
    
    // Remove this hook after execution
//    $app.removeAllHooks();
});
```
I have commented out the remove hooks line, so manually remove this hook after first start.

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
