migrate((db) => {
  const collection = new Collection({
    "id": "d2ncqq3r9nokzxb",
    "created": "2023-01-16 15:57:20.077Z",
    "updated": "2023-01-16 15:57:20.077Z",
    "name": "users",
    "type": "auth",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "1vrapqlw",
        "name": "fullname",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "lfcoz57i",
        "name": "memberOf",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "maxSelect": 10,
          "collectionId": "019cnmnzyewyzaj",
          "cascadeDelete": false
        }
      }
    ],
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
  const collection = dao.findCollectionByNameOrId("d2ncqq3r9nokzxb");

  return dao.deleteCollection(collection);
})
