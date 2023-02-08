migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qipjuh4mgbdwqxl")

  collection.listRule = ""
  collection.viewRule = ""
  collection.updateRule = ""

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
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qipjuh4mgbdwqxl")

  collection.listRule = null
  collection.viewRule = null
  collection.updateRule = null

  // remove
  collection.schema.removeField("eebcmvji")

  return dao.saveCollection(collection)
})
