migrate((db) => {
  const collection = new Collection({
    "id": "m65dv1l7uny11t1",
    "created": "2023-02-24 17:24:34.308Z",
    "updated": "2023-02-24 17:24:34.308Z",
    "name": "logs",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "ytf73ay4",
        "name": "user",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "ps3lmg3i",
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
        "id": "g5tznlt6",
        "name": "details",
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
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("m65dv1l7uny11t1");

  return dao.deleteCollection(collection);
})
