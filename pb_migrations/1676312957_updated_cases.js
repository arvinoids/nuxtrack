migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lmsussoqnefoa8f")

  collection.updateRule = "(@request.auth.role = 'admin'||@request.auth.role ='lead')"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lmsussoqnefoa8f")

  collection.updateRule = null

  return dao.saveCollection(collection)
})
