migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("m65dv1l7uny11t1")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ps3lmg3i",
    "name": "type",
    "type": "select",
    "required": true,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "assigned case",
        "updated case",
        "deleted case",
        "dismissed notification",
        "skipped user"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("m65dv1l7uny11t1")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ps3lmg3i",
    "name": "type",
    "type": "select",
    "required": true,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "assigned case",
        "update case",
        "delete case",
        "dismissed notification",
        "skipped user"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
