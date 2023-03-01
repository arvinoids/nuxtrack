migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("7ia9ctm0dzz6i1h");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "7ia9ctm0dzz6i1h",
    "created": "2023-02-24 16:06:15.693Z",
    "updated": "2023-02-24 16:39:24.107Z",
    "name": "logs",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "wqznvagx",
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
        "id": "i2me3ejn",
        "name": "type",
        "type": "select",
        "required": true,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "add case",
            "update case",
            "delete case",
            "dismissed notification",
            "skipped user"
          ]
        }
      },
      {
        "system": false,
        "id": "vylacxc7",
        "name": "reason",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
})
