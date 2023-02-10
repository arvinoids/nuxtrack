migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("d2ncqq3r9nokzxb")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "75fspfm0",
    "name": "role",
    "type": "select",
    "required": true,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "user",
        "lead",
        "admin"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("d2ncqq3r9nokzxb")

  // remove
  collection.schema.removeField("75fspfm0")

  return dao.saveCollection(collection)
})
