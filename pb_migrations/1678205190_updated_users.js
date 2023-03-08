migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("d2ncqq3r9nokzxb")

  collection.deleteRule = "@request.auth.role=\"admin\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("d2ncqq3r9nokzxb")

  collection.deleteRule = null

  return dao.saveCollection(collection)
})
