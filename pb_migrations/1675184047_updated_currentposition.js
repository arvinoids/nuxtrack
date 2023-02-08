migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qipjuh4mgbdwqxl")

  // remove
  collection.schema.removeField("asqqsqea")

  // add
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "z2km2nt0",
    "name": "position",
    "type": "number",
    "required": true,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qipjuh4mgbdwqxl")

  // add
  collection.schema.addField(new SchemaField({
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
  }))

  // remove
  collection.schema.removeField("oho9mfck")

  // remove
  collection.schema.removeField("z2km2nt0")

  return dao.saveCollection(collection)
})
