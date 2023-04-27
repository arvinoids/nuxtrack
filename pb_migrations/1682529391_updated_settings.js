migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cevecfp4sp8qdz5")

  collection.listRule = "@request.auth.id!=null"
  collection.viewRule = "@request.auth.id!=null"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cevecfp4sp8qdz5")

  collection.listRule = null
  collection.viewRule = null

  return dao.saveCollection(collection)
})
