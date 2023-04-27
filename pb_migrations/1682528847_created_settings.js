migrate((db) => {
  const collection = new Collection({
    "id": "cevecfp4sp8qdz5",
    "created": "2023-04-26 17:07:27.357Z",
    "updated": "2023-04-26 17:07:27.357Z",
    "name": "settings",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "1gwci2b9",
        "name": "emailtoken",
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
  const collection = dao.findCollectionByNameOrId("cevecfp4sp8qdz5");

  return dao.deleteCollection(collection);
})
