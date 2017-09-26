/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

var uuid = require('node-uuid')

var Restaurant = require('models/restaurant')
var MenuItem = require('models/menu-item')

var putCallback = function(err, data) {
    if (err) {
        console.log(err)
    }
}

function createMenuItem(dynamo_storage, data) {
    var menu_item = new MenuItem(data)
    MenuItem.create(dynamo_storage, menu_item, putCallback)

    return menu_item
}

function createMenu(dynamo_storage, restaurant_id) {
    createMenuItem(dynamo_storage, {
        restaurant_id: restaurant_id,
        name: "Golden Ratio Bacon Skewers",
        description: "Fibonacci on a stick! Who doesn’t like bacon on a stick that keeps going?"
    })

    createMenuItem(dynamo_storage, {
        restaurant_id: restaurant_id,
        name: "Abelian Cucumber Salad",
        description: "A cool and refreshing salad for any hot summer day."
    })

    createMenuItem(dynamo_storage, {
        restaurant_id: restaurant_id,
        name: "Chili-Cucumber orientable Corn",
        description: "Feel like you’re connected to nature with corn that wraps around your belly."
    })

    createMenuItem(dynamo_storage, {
        restaurant_id: restaurant_id,
        name: "Finite Short-Rib Fields",
        description: "No utensils! BBQ is finger food!"
    })

    createMenuItem(dynamo_storage, {
        restaurant_id: restaurant_id,
        name: "Easy Fractal Salad",
        description: "This symmetric pasta salad features feta, artichoke hearts, and kale."
    })
}

function createRestaurant(dynamo_storage, data) {
    var restaurant = new Restaurant(data)
    Restaurant.create(dynamo_storage, restaurant, putCallback)

    return restaurant
}

function initData(dynamo_storage) {
    var restaurant = createRestaurant(dynamo_storage, {
        name: "Euclid’s Chicken and Gravy",
        address: "9372 GCD 229, Round Rock, TX 73829",
        phone: "(512) 351-9724",
        rating: 4.6
    })
    createMenu(dynamo_storage, restaurant.id)

    var restaurant = createRestaurant(dynamo_storage, {
        name: "Descartes Bar + Kitchen",
        address: "1596 Cartesian Blvd, Austin, TX 03928",
        phone: "(512) 836-5700",
        rating: 4.5
    })
    createMenu(dynamo_storage, restaurant.id)

    var restaurant = createRestaurant(dynamo_storage, {
        name: "Fermat’s Poke",
        address: "1640 Last Way, Dallas, TX 02391",
        phone: "n/a",
        rating: 4.4
    })
    createMenu(dynamo_storage, restaurant.id)

    var restaurant = createRestaurant(dynamo_storage, {
        name: "Euler’s Classic Cooking",
        address: "1851 Series Street, Dallas, TX 02938",
        phone: "(512) 323-0153",
        rating: 4.3
    })
    createMenu(dynamo_storage, restaurant.id)

    var restaurant = createRestaurant(dynamo_storage, {
        name: "Euclidian Eats",
        address: "2 Cosets Ave, Austin, TX, 02981",
        phone: "(512) 293-6118",
        rating: 4.2
    })
    createMenu(dynamo_storage, restaurant.id)
}

exports.init = initData
