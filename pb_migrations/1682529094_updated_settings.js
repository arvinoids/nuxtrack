migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cevecfp4sp8qdz5")

  collection.updateRule = "@request.auth.role='admin'"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cevecfp4sp8qdz5")

  collection.updateRule = null

  return dao.saveCollection(collection)
})
