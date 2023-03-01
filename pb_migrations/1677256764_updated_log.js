migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7ia9ctm0dzz6i1h")

  collection.name = "logs"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7ia9ctm0dzz6i1h")

  collection.name = "log"

  return dao.saveCollection(collection)
})
