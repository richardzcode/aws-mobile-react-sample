/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');

var DynamoStorage = require('../storages/dynamo');
var S3Storage = require('../storages/s3');

var Restaurant = require('../models/restaurant');
var MenuItem = require('../models/menu-item');
var ModelUtil = require('../utils/model-util');

AWS.config.update({ region: process.env.REGION });

var dynamoDb = new AWS.DynamoDB.DocumentClient();
var storage = new DynamoStorage(dynamoDb);

var s3 = new AWS.S3({
	signatureVersion: 'v4'
});
var s3Storage = new S3Storage(s3);


/**********************
 * Restaurant methods *
 **********************/

router.get('/', function(req, res) {
	Restaurant.findAll(storage, function(err, restaurants) {
        if (err) {
            console.log(err)
            res.status(500).json({
                message: "Could not load restaurants"
            }).end();
        } else {
            res.json(ModelUtil.toDataList(restaurants));
        }
	});
});

router.get('/:restaurantId', function(req, res) {
    // Extracts a specific restaurant from the databsae. If an invalid restaurantId is sent
    // we will returna 400 status code. If the parameter value is valid but we cannot find
    // that restaurant in our database we return a 404

    var restaurant_id = req.params.restaurantId
    if (!restaurant_id) {
        res.status(400).json({
            message: "Invalid restaurant ID"
        }).end();
    }

    Restaurant.find(storage, restaurant_id, function(err, restaurant) {
        if (err) {
            console.log(err)
            res.status(500).json({
                message: "Could not load restaurant"
            }).end();
        } else {
        	if (restaurant) {
        		res.json(restaurant.data)
        	} else {
        		res.status(404).json({
                    message: "The restaurant does not exist"
                });
        	}
        }
    });
});

router.delete('/:restaurantId', function(req, res) {
    var restaurant_id = req.params.restaurantId
    if (!restaurant_id) {
        res.status(400).json({
            message: "Invalid restaurant ID"
        }).end();
    }

    Restaurant.delete(storage, restaurant_id, function(err, data) {
        if (err) {
            console.log(err)
            res.status(500).json({
                message: "Could not delete restaurant"
            }).end();
        } else {
            res.json(data);
        }
    });
});

router.get('/:restaurantId/cover', function(req, res) {
	console.log('get cover requested')
	var restaurant_id = req.params.restaurantId
    if (!restaurant_id) {
        res.status(400).json({
            message: "Invalid restaurant ID"
        }).end();
    }

    var path = restaurant_id + '_cover'
    s3Storage.get(path, function(err, data) {
    	res.end(data, 'binary')
    });
});

router.put('/:restaurantId/cover', function(req, res) {
	var restaurant_id = req.params.restaurantId
    if (!restaurant_id) {
        res.status(400).json({
            message: "Invalid restaurant ID"
        }).end()
    }

    var body = req.body
    var content = Buffer.from(body.content, 'base64')
    var meta = {
    	'Content-Type': body.type
    }

    var path = 'public/' + restaurant_id + '_cover'
    s3Storage.upload(path, content, meta, function(err, data) {
    	if (err) {
    		res.json({
    			err: err
    		});
    		return;
    	}

    	var photo_url = data.Location;
    	console.log('photo url: ' + photo_url);
    	Restaurant.updateCover(storage, restaurant_id, photo_url, function(err, data) {
    		console.log('update cover done')
    		if (err) {
    			console.log(err)
    		} else {
    			console.log(data)
    		}
    	});

    	console.log('presign ' + path)
    	s3Storage.presign(path, function(err, url) {
    		console.log('presigned: ' + url);
    	});

    	res.json({
    		restaurant_id: restaurant_id,
    		url: photo_url
    	});
    });

	//res.json({restaurant_id: restaurant_id})
});

/***************************
 * Restaurant menu methods *
 ***************************/

router.get('/:restaurantId/menu', function(req, res) {
    // lists all of the menu items for a restaurant.

    var restaurant_id = req.params.restaurantId
    if (!restaurant_id) {
        res.status(400).json({
            message: "Invalid restaurant ID"
        }).end();
    }

    var menu_items = MenuItem.findByRestaurantId(storage, restaurant_id, function(err, items) {
        if (err) {
            console.log(err)
            res.status(500).json({
                message: "Could not load restaurant menu"
            }).end();
        } else {
            res.json(ModelUtil.toDataList(items));
        }
    });
});

router.get('/:restaurantId/menu/:itemId', function(req, res) {
    // extracts the details of a specific menu item

    var restaurant_id = req.params.restaurantId,
    	item_id = req.params.itemId;

    if (!restaurant_id || !item_id) {
        res.status(400).json({
            message: "Invalid restaurant or item identifier"
        }).end();
    }

    MenuItem.find(storage, item_id, restaurant_id, function(err, item) {
    	if (err) {
            console.log(err)
            res.status(500).json({
                message: "Could not load menu item"
            }).end();
        } else {
        	if (!item || item.restaurant_id !== restaurant_id) {
        		// return 404 if we couldn't find the menu item in the database
                res.status(404).json({
                    message: "The menu item does not exist"
                });
        	} else {
        		res.json(item.data);
        	}
        }
    });
});

module.exports = router