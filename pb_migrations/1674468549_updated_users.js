migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("d2ncqq3r9nokzxb")

  collection.updateRule = null

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("d2ncqq3r9nokzxb")

  collection.updateRule = "@request.auth.id = @collection.users.id"

  return dao.saveCollection(collection)
})
