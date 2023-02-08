migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lmsussoqnefoa8f")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "smm02ype",
    "name": "assignedBy",
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
  const collection = dao.findCollectionByNameOrId("lmsussoqnefoa8f")

  // remove
  collection.schema.removeField("smm02ype")

  return dao.saveCollection(collection)
})
