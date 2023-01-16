migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ocmck4lu5u4m7eq")

  // remove
  collection.schema.removeField("lx1gwmwp")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ipsnf4tw",
    "name": "count",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "flbuz48h",
    "name": "order",
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
  const collection = dao.findCollectionByNameOrId("ocmck4lu5u4m7eq")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lx1gwmwp",
    "name": "order",
    "type": "number",
    "required": true,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  // remove
  collection.schema.removeField("ipsnf4tw")

  // remove
  collection.schema.removeField("flbuz48h")

  return dao.saveCollection(collection)
})
