var dataSync = require('../lib/data-sync')()
  , originalData = [
      {id: 1, name: 'Fred'},
      {id: 2, name: 'Jim'},
      {id: 3, name: 'Tom'}
    ]
  , newData = [
      {id: 1, name: 'Fred'},
      {id: 3, name: 'Barney'},
      {id: 4, name: 'Dave'}
    ];

function isDifferent(first, second) {
  return Object.keys(second).some(function(key) {
    return first[key] !== second[key];
  });
}

function create(item, callback) {
  originalData.push(item);
  callback();
}

function update(uniqueId, oldItem, newItem, callback) {
  originalData.some(function(item, index) {
    if (originalData[index].id === uniqueId) {
      originalData[index] = newItem;
      return true;
    }
  });
  callback();
}

function del(uniqueId, oldItem, callback) {
  originalData.some(function(item, index) {
    if (originalData[index].id === uniqueId) {
      originalData.splice(index, 1);
      return true;
    }
  });
  callback();
}

describe('data-sync.js', function() {

  describe('#formatArray()', function() {
    it('should format array into hash ready for use in sync', function() {
      var originalHash = dataSync.formatArray('id', originalData);

      Object.keys(originalHash).length.should.equal(3);

      Object.keys(originalHash)[0].should.equal('1');
      Object.keys(originalHash)[1].should.equal('2');
      Object.keys(originalHash)[2].should.equal('3');

      originalHash['1'].id.should.equal(1);
      originalHash['2'].id.should.equal(2);
      originalHash['3'].id.should.equal(3);

      originalHash['1'].name.should.equal('Fred');
      originalHash['2'].name.should.equal('Jim');
      originalHash['3'].name.should.equal('Tom');
    });
  });

  describe('#sync()', function() {
    it('should synchronise both objects', function(done) {
      var originalHash = dataSync.formatArray('id', originalData)
        , newHash = dataSync.formatArray('id', newData);

      dataSync.sync(originalHash, newHash, 'id', isDifferent, create, update, del, function() {
        originalData.length.should.equal(3);

        originalData[0].id.should.equal(1);
        originalData[1].id.should.equal(3);
        originalData[2].id.should.equal(4);

        originalData[0].name.should.equal('Fred');
        originalData[1].name.should.equal('Barney');
        originalData[2].name.should.equal('Dave');
        done();
      });
    });
  });

});
