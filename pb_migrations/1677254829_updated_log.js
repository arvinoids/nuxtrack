migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7ia9ctm0dzz6i1h")

  collection.listRule = ""
  collection.viewRule = ""
  collection.createRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7ia9ctm0dzz6i1h")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null

  return dao.saveCollection(collection)
})
