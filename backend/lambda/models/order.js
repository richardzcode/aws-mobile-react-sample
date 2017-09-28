/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

var uuid = require('node-uuid')

var Order = function(data) {
    if (!data.id) { data.id = uuid.v1(); }
    this.data = data
}

Order.TABLE_NAME = process.env.ORDERS_TABLE_NAME;

Order.find = function(storage, id, callback) {
    storage.find(Order.TABLE_NAME, id, function(err, data) {
        if (!callback) {
            console.log('WARN: no callback in Order find')
            return
        }

        if (err) {
            callback(err)
        } else {
            if (data) { callback(null, new Order(data)); } else { callback(null, null); }
        }
    })
}

Order.create = function(storage, order, callback) {
    storage.create(Order.TABLE_NAME, order.data, function(err, data) {
        if (!callback) {
            console.log('WARN: no callback in Order create')
            return
        }

        if (err) {
            callback(err)
        } else {
            callback(null, order)
        }
    })
}

module.exports = Order