migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("q1j3xojkiy1s5z7")

  collection.updateRule = ""
  collection.deleteRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("q1j3xojkiy1s5z7")

  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
