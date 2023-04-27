migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cevecfp4sp8qdz5")

  collection.name = "setting"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cevecfp4sp8qdz5")

  collection.name = "settings"

  return dao.saveCollection(collection)
})
