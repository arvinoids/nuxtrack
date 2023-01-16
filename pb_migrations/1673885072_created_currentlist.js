migrate((db) => {
  const collection = new Collection({
    "id": "ocmck4lu5u4m7eq",
    "created": "2023-01-16 16:04:32.785Z",
    "updated": "2023-01-16 16:04:32.785Z",
    "name": "currentlist",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "ucpgmgsf",
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
        "id": "wnkxzq0t",
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
        "id": "lx1gwmwp",
        "name": "order",
        "type": "number",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null
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
  const collection = dao.findCollectionByNameOrId("ocmck4lu5u4m7eq");

  return dao.deleteCollection(collection);
})
