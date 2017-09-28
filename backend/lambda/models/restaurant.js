/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

var uuid = require('node-uuid')

var Restaurant = function(data) {
    if (!data.id) { data.id = uuid.v1(); }

    this.id = data.id;
    this.data = data
}

Restaurant.TABLE_NAME = process.env.RESTAURANTS_TABLE_NAME

Restaurant.findAll = function(storage, callback) {
    storage.findAll(Restaurant.TABLE_NAME, function(err, data) {
        if (!callback) {
            console.log('WARN: no callback in Restaurant findAll')
            return
        }

        if (err) {
            callback(err)
        } else {
            list = []
            for (var i = 0; i < data.length; i++) {
                var restaurant = new Restaurant(data[i])
                list.push(restaurant)
            }

            callback(null, list)
        }
    })
}

Restaurant.find = function(storage, id, callback) {
    storage.find(Restaurant.TABLE_NAME, id, function(err, data) {
        if (!callback) {
            console.log('WARN: no callback in Restaurant find')
            return
        }

        if (err) {
            callback(err)
        } else {
            if (data) { callback(null, new Restaurant(data)); } else { callback(null, null); }
        }
    })
}

Restaurant.create = function(storage, restaurant, callback) {
    storage.create(Restaurant.TABLE_NAME, restaurant.data, function(err, data) {
        if (!callback) {
            console.log('WARN: no callback in Restaurant create')
            return
        }

        if (err) {
            callback(err)
        } else {
            callback(null, restaurant)
        }
    })
}

Restaurant.delete = function(storage, id, callback) {
    storage.delete(Restaurant.TABLE_NAME, id, function(err, data) {
        if (!callback) {
            console.log('WARN: no callback in Restaurant delete')
            return
        }

        callback(err, data);
    })
}

Restaurant.updateCover = function(storage, restaurant_id, path, callback) {
    storage.update(Restaurant.TABLE_NAME, restaurant_id, 'cover', path, function(err, data) {
        if (!callback) {
            console.log('WARN: no callback in Restaurant updateCover')
            return
        }

        console.log('Restaurant updateCover done')
        if (err) {
            callback(err)
        } else {
            callback(null, data)
        }
    })
}

module.exports = Restaurant