migrate((db) => {
  const collection = new Collection({
    "id": "qipjuh4mgbdwqxl",
    "created": "2023-01-18 13:59:51.889Z",
    "updated": "2023-01-18 13:59:51.889Z",
    "name": "currentposition",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "asqqsqea",
        "name": "group",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": 1,
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
  const collection = dao.findCollectionByNameOrId("qipjuh4mgbdwqxl");

  return dao.deleteCollection(collection);
})
