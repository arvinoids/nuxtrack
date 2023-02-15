migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lmsussoqnefoa8f")

  collection.createRule = "@request.data.id:isset =true"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lmsussoqnefoa8f")

  collection.createRule = null

  return dao.saveCollection(collection)
})
