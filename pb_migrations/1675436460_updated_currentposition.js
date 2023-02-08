migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qipjuh4mgbdwqxl")

  // remove
  collection.schema.removeField("eebcmvji")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qipjuh4mgbdwqxl")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "eebcmvji",
    "name": "field",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
})
