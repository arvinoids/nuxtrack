migrate((db) => {
  const collection = new Collection({
    "id": "q1j3xojkiy1s5z7",
    "created": "2023-01-16 16:01:51.794Z",
    "updated": "2023-01-16 16:01:51.794Z",
    "name": "counter",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "exkhw6ut",
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
        "id": "o2e7vjhf",
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
        "id": "vhsvmoui",
        "name": "count",
        "type": "number",
        "required": false,
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
  const collection = dao.findCollectionByNameOrId("q1j3xojkiy1s5z7");

  return dao.deleteCollection(collection);
})
