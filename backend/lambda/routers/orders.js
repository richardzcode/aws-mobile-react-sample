/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

var express = require('express')
var router = express.Router()
var AWS = require('aws-sdk')
var uuid = require('node-uuid')

var DynamoStorage = require('../storages/dynamo')

var Order = require('../models/order')

AWS.config.update({ region: process.env.REGION })

var dynamoDb = new AWS.DynamoDB.DocumentClient()
var storage = new DynamoStorage(dynamoDb)

/****************************
 * Order management methods *
 ****************************/

router.post('/', function(req, res) {
    var order = {}
    if (!req.body.restaurant_id) {
        res.status(400).json({
            message: "Invalid restaurant id in order"
        }).end()
        return
    }
    if (!req.body.menu_items || req.body.menu_items.length == 0) {
        res.status(400).json({
            message: "You must order at least one item"
        }).end()
        return
    }

    var order = new Order({
        restaurant_id: req.body.restaurant_id,
        menu_items: req.body.menu_items
    })

    Order.create(storage, order, function(err, order) {
        if (err) {
            console.log(err)
            res.status(500).json({
                message: "Could not create order" + err + Order.TABLE_NAME
            }).end()
        } else {
            res.json(order.data)
        }
    })
})

router.get('/:orderId', function(req, res) {
    var order_id = req.params.orderId
    if (!order_id) {
        res.status(400).json({
            message: "Invalid order id"
        })
    }

    Order.find(storage, order_id, function(err, order) {
        if (err) {
            console.log(err)
            res.status(500).json({
                message: "Could not load order"
            }).end()
        } else {
            if (order) {
                res.json(order.data)
            } else {
                res.status(404).json({
                    message: "The order does not exist"
                })
            }
        }
    })
})

router.delete('/:orderId', function(req, res) {
    var order_id = req.params.orderId
    if (!order_id) {
        res.status(400).json({
            message: "Invalid order id"
        })
    }

    Order.delete(storage, order_id, function(err, data) {
        if (err) {
            console.log(err)
            res.status(500).json({
                message: "Could not delete order"
            }).end()
        } else {
            // if the item was deleted then we return a 204 - success but there's no content
            res.status(204).end()
        }
    })
})

module.exports = router