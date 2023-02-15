migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lmsussoqnefoa8f")

  collection.updateRule = ""
  collection.deleteRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lmsussoqnefoa8f")

  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
