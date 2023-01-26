migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("019cnmnzyewyzaj")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "0tfrjlwc",
    "name": "order",
    "type": "number",
    "required": false,
    "unique": true,
    "options": {
      "min": 1,
      "max": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("019cnmnzyewyzaj")

  // remove
  collection.schema.removeField("0tfrjlwc")

  return dao.saveCollection(collection)
})
