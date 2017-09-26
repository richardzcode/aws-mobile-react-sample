/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

var express = require('express')
var bodyParser = require('body-parser')
var AWS = require('aws-sdk')
var DynamoStorage = require('storages/dynamo')

var restaurants = require('routers/restaurants')
var orders = require('routers/orders')

// the init file is only used to populate the database the first time
var init = require('./init.js')

AWS.config.update({ region: process.env.REGION })

// The DocumentClient class allows us to interact with DynamoDB using normal objects.
// Documentation for the class is available here: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html
var dynamoDb = new AWS.DynamoDB.DocumentClient()

var dynamo_storage = new DynamoStorage(dynamoDb)

// declare a new express app
var app = express()
app.use(bodyParser.json())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});

app.use('/items/restaurants', restaurants)
app.use('/items/orders', orders)

/**
 * This is the init API to pre-populate the database with restaurants and a menu
 */
app.post('/items/init', function(req, res) {
    init.init(dynamo_storage)
    res.json({
        message: "Init completed!"
    })
})

app.listen(3000, function() {
    console.log("App started")
})

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
