var pluck = require('lodash.pluck')
  , difference = require('lodash.difference')
  , intersection = require('lodash.intersection')
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
    var aIds = pluck(a, uniqueId)
      , bIds = pluck(b, uniqueId)
      , c = difference(aIds, bIds)
      , d = intersection(aIds, bIds)
      , e = difference(bIds, d)

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
