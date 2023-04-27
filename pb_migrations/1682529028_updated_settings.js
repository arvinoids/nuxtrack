migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cevecfp4sp8qdz5")

  collection.viewRule = "@request.auth.username!=null"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cevecfp4sp8qdz5")

  collection.viewRule = null

  return dao.saveCollection(collection)
})
