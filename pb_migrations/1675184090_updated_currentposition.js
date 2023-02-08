migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qipjuh4mgbdwqxl")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "oho9mfck",
    "name": "group",
    "type": "relation",
    "required": false,
    "unique": true,
    "options": {
      "maxSelect": 1,
      "collectionId": "019cnmnzyewyzaj",
      "cascadeDelete": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qipjuh4mgbdwqxl")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "oho9mfck",
    "name": "group",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "collectionId": "019cnmnzyewyzaj",
      "cascadeDelete": false
    }
  }))

  return dao.saveCollection(collection)
})
