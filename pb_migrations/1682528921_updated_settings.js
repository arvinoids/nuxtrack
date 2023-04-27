migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cevecfp4sp8qdz5")

  // remove
  collection.schema.removeField("1gwci2b9")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ybfzdeem",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "hhvxyp5l",
    "name": "value",
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
  const collection = dao.findCollectionByNameOrId("cevecfp4sp8qdz5")

  // add
  collection.schema.addField(new SchemaField({
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
  }))

  // remove
  collection.schema.removeField("ybfzdeem")

  // remove
  collection.schema.removeField("hhvxyp5l")

  return dao.saveCollection(collection)
})
