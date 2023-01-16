migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("q1j3xojkiy1s5z7")

  collection.listRule = ""
  collection.viewRule = ""
  collection.createRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("q1j3xojkiy1s5z7")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null

  return dao.saveCollection(collection)
})
