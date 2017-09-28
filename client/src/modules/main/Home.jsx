/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';

import Restaurants from './Restaurants';
import AppConfig from '../../configuration/AppConfig';
import ContentBlock from '../../components/ContentBlock';
import RestClient from '../../clients/RestClient';
import Logger from '../../utils/Logger';

const logger = new Logger('Home');

export default class Home extends Component {
    state = {
        restaurants: [],
        loading: null,
    };

    fetchRestaurants = () => {
        this.setState({
            loading: true
        });
        RestClient.get(AppConfig.API.restaurant.root)
            .then(response => {
                this.setState({
                    restaurants: response.data,
                    loading: false
                });
            })
            .catch (err => logger.error(err));
    };

    initRestaurant = () => {
        var that = this;
        RestClient.post(AppConfig.API.restaurant.init)
            .then(response => {
                alert('Successfully inserted restaurants');
                that.setState({
                    restaurants: response.data.restaurants,
                    loading: false
                });
            })
            .catch (err => logger.error(err));
    };

    deleteRestaurant(restaurant_id) {
        console.log('Deleting ' + restaurant_id);
        var that = this;
        RestClient.delete(AppConfig.API.restaurant.restaurant(restaurant_id))
            .then(response => {
                logger.info('Deleted');
                var restaurants = that.state.restaurants.filter(function(restaurant) {
                        return restaurant.id !== restaurant_id;
                    });
                that.setState({
                    restaurants: restaurants
                });
            })
            .catch (err => logger.error(err));
    }

    render() {
        logger.info(JSON.stringify(this.state.restaurants));
        return (
            <ContentBlock>
                <h4>Load your local restaurants with the button below and click the name to view the menu</h4>
                <div className="content-button">
                    <Button primary onClick={this.fetchRestaurants}>
                        List Restaurants
                    </Button>
                    <Button primary onClick={this.initRestaurant}>
                        Insert Restaurants
                    </Button>
                </div>
                <Restaurants
                    tableData={this.state.restaurants}
                    loading={this.state.loading}
                    deleteRestaurant={(id) => this.deleteRestaurant(id)}
                />
            </ContentBlock>
        );
    }
}
