[![build status](https://secure.travis-ci.org/aduncan88/data-sync.png)](http://travis-ci.org/aduncan88/data-sync)
# data-sync.js
A simple JavaScript synchronisation module for Node.JS. Used to keep two sets of data which have a unique key in sync whilst keeping data writes to a minimum.

## Installation

    npm install data-sync

## Usage


### Example

    var dataSync = require('data-sync')()

    dataSync.sync(
      dataSync.formatArray('id', originalData)
      dataSync.formatArray('id', newData),
      'id',
      isDifferent,
      create,
      update,
      del,
      function(error) {
        console.log('Data Sync Complete')
      }
    )

For a complete example please refer to the included unit test.

### Explanation

The data-sync module contains two functions. These are:

    formatArray(uniqueId, dataArray)
    sync(originalDataHash, newDataHash, uniqueId, comparatorFunction, createFunction, updateFunction, deleteFunction, finalCallback)


#### formatArray
formatArray is used to convert an array of data into the correct format required to perform the data sync.
It takes two parameters. These are as follows:

1. **unqiueId**: The name of the key which is to be used as a unique ID for each object.
2. **dataArray**: The array of data.

e.g input

    formatArray(
      'id',
      [
        {id: 1, name: 'Fred'},
        {id: 2, name: 'Jim'},
        {id: 3, name: 'Tom'}
      ]
    )

e.g output

    {
      1: {id: 1, name: 'Fred'},
      2: {id: 2, name: 'Jim'},
      3: {id: 3, name: 'Tom'}
    }

#### sync

sync is used to perform the actual data syncronisation. It takes 8 parameters. These are as follows:

1. **originalDataHash**: Original data in the format produced by calling *formatArray()*.
2. **newDataHash**: New data in the format produced by calling *formatArray()*.
3. **uniqueId**: Name of the key which is to be used as a unique ID for each object.
4. **comparatorFunction**: Used to determine if two objects should be considered different and therefore call update(). Should return true if there is a difference. Parameters are: oldObject, newObject.
5. **createFunction** Function called when an object is present within the new data which is not in the original. Parameters are newObject, callback.
6. **updateFunction** Function called when an object has changed within the new data. Parameters are uniqueIdValue, oldObject, newObject, callback.
7. **deleteFunction** Function called when an object is present within the original data, but not the new data. Parameters are uniqueIdValue, oldObject, callback.
8. **finalCallback** Function called when data syncronisation is complete.

e.g

Given the following:

    var originalData = [
          {id: 1, name: 'Fred'},
          {id: 2, name: 'Jim'},
          {id: 3, name: 'Tom'}
        ]
      , newData = [
          {id: 1, name: 'Fred'},
          {id: 3, name: 'Barney'},
          {id: 4, name: 'Dave'}
        ];

You would expect the output from calling sync() to be:

    originalData = [
      {id: 1, name: 'Fred'},
      {id: 3, name: 'Barney'},
      {id: 4, name: 'Dave'}
    ];


## Credits
[Adam Duncan](https://github.com/aduncan/) follow me on [twitter](http://twitter.com/ajduncan88)

[Paul Serby](https://github.com/serby/)

## Licence
Licenced under the [New BSD License](http://opensource.org/licenses/bsd-license.php)
