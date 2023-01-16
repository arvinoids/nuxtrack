migrate((db) => {
  const collection = new Collection({
    "id": "5kosx0r7ctnhcka",
    "created": "2023-01-16 15:50:36.705Z",
    "updated": "2023-01-16 15:50:36.705Z",
    "name": "users",
    "type": "auth",
    "system": false,
    "schema": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {
      "allowEmailAuth": true,
      "allowOAuth2Auth": true,
      "allowUsernameAuth": true,
      "exceptEmailDomains": null,
      "manageRule": null,
      "minPasswordLength": 8,
      "onlyEmailDomains": null,
      "requireEmail": false
    }
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("5kosx0r7ctnhcka");

  return dao.deleteCollection(collection);
})
