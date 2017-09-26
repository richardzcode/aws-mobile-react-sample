/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

import React, { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';

import AppConfig from '../../configuration/AppConfig';
import ContentBlock from '../../components/ContentBlock';
import HttpClient from '../../clients/HttpClient';
import Logger from '../../utils/Logger';

const logger = new Logger('Menu');

export default class Menu extends Component {

    state = {
        menuItems: []
    }

    componentWillMount() {
        var restaurant_id = sessionStorage.getItem('currentRestaurantId');
        restaurant_id ? this.fetchMenuList(restaurant_id) : false;
    }

    fetchMenuList = (restaurant_id) => {
        HttpClient.get(AppConfig.API.restaurant.menu(restaurant_id))
            .then(response => {
                logger.info(response.data);
                this.setState({
                    menuItems: response.data
                });
                return data;
            })
            .catch (err => { throw error; });
    }

    orderItem = (restaurant_id, item_id) => {
        let body = JSON.stringify({
            'restaurant_id': restaurant_id,
            'menu_items': [{
                'id':item_id,
                'quantity': 1
            }]
        });

        HttpClient.post(AppConfig.API.order.root, body)
            .then(response => {
                sessionStorage.setItem('latestOrder', response.data.id);
                logger.info(response.data);
                alert('Ordered successfully');
            })
            .catch (err => logger.error(err));
    }

    render() {
        const currentRestaurant = sessionStorage.getItem('currentRestaurant');
        logger.info(currentRestaurant);
        return (
            <ContentBlock>
                <h4>{currentRestaurant ? 'Click below to order an item from ' + currentRestaurant : 'Please select one restaurant' }</h4>
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Item Name</Table.HeaderCell>
                            <Table.HeaderCell>Order</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        { this.state.menuItems && this.state.menuItems.map((item, i) =>
                        <Table.Row key={item.id}>
                            <Table.Cell>{item.name}</Table.Cell>
                            <Table.Cell>{item.description}</Table.Cell>
                            <Table.Cell><Button primary onClick={this.orderItem.bind(this, item.restaurant_id, item.id)}>Order</Button></Table.Cell>
                        </Table.Row>
                        )}
                    </Table.Body>
                </Table>
            </ContentBlock>
        );
    }
}
