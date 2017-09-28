/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

var uuid = require('node-uuid')

var MenuItem = function(data) {
    if (!data.id) { data.id = uuid.v1(); }
    if (!data.photo) { data.photo = []; }

    this.id = data.id;
    this.data = data
}

MenuItem.TABLE_NAME = process.env.MENU_TABLE_NAME;

MenuItem.find = function(storage, id, restaurant_id, callback) {
    storage.find(MenuItem.TABLE_NAME, {restaurant_id: restaurant_id, id: id}, function(err, data) {
        if (!callback) {
            console.log('WARN: no callback in MenuItem find')
            return
        }

        if (err) {
            callback(err)
        } else {
            if (data) { callback(null, new MenuItem(data)); } else { callback(null, null); }
        }
    })
}

MenuItem.create = function(storage, menu_item, callback) {
    storage.create(MenuItem.TABLE_NAME, menu_item.data, function(err, data) {
        if (!callback) {
            console.log('WARN: no callback in MenuItem create')
            return
        }

        if (err) {
            callback(err)
        } else {
            callback(null, menu_item)
        }
    })
}

MenuItem.findByRestaurantId = function(storage, restaurant_id, callback) {
    storage.findBy(MenuItem.TABLE_NAME, {restaurant_id: restaurant_id}, function(err, data) {
        if (!callback) {
            console.log('WARN: no callback in MenuItem create')
            return
        }

        if (err) {
            callback(err)
        } else {
            list = []
            for (var i = 0; i < data.length; i++) {
                var menuItem = new MenuItem(data[i])
                list.push(menuItem)
            }

            callback(null, list)
        }
    })
}

module.exports = MenuItem