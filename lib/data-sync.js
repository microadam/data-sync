var _ = require('underscore')
  , async = require('async')

module.exports = function () {

  var self = {}

  self.formatArray = function (uniqueId, array) {
    var hash = {}
    array.forEach(function (item) {
      hash[item[uniqueId]] = item
    })
    return hash
  }

  self.sync = function (a, b, uniqueId, isDifferent, create, update, del, finalCallback) {
    // Create sets
    var aIds = _.pluck(a, uniqueId)
      , bIds = _.pluck(b, uniqueId)
      , c = _.difference(aIds, bIds)
      , d = _.intersection(aIds, bIds)
      , e = _.difference(bIds, d)

    async.parallel(
      [
        function (paraCallback) {
          // Delete omitted items
          async.forEach(
            c,
            function (index, eachCallback) {
              del(index, a[index], eachCallback)
            },
            paraCallback
          )
        },
        function (paraCallback) {
          // Update only those that have changed
          async.forEach(
            d,
            function (index, eachCallback) {
              if (isDifferent(a[index], b[index])) {
                update(index, a[index], b[index], eachCallback)
              } else {
                eachCallback()
              }
            },
            paraCallback
          )
        },
        function (paraCallback) {
          // Insert new items
          async.forEach(
            e,
            function (index, eachCallback) {
              create(b[index], eachCallback)
            },
            paraCallback
          )
        }
      ],
      finalCallback
    )

  }

  return self
}
