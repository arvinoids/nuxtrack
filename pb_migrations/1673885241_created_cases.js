migrate((db) => {
  const collection = new Collection({
    "id": "lmsussoqnefoa8f",
    "created": "2023-01-16 16:07:21.013Z",
    "updated": "2023-01-16 16:07:21.013Z",
    "name": "cases",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "23kclimv",
        "name": "user",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "collectionId": "d2ncqq3r9nokzxb",
          "cascadeDelete": false
        }
      },
      {
        "system": false,
        "id": "tqekneok",
        "name": "group",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "collectionId": "019cnmnzyewyzaj",
          "cascadeDelete": false
        }
      },
      {
        "system": false,
        "id": "ug6psfcp",
        "name": "case",
        "type": "text",
        "required": true,
        "unique": true,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("lmsussoqnefoa8f");

  return dao.deleteCollection(collection);
})
