/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

import React, { Component } from 'react';
import { Label, List } from 'semantic-ui-react';

import AppConfig from '../../configuration/AppConfig';
import ContentBlock from '../../components/ContentBlock';
import RestClient from '../../clients/RestClient';
import Logger from '../../utils/Logger';

const logger = new Logger('Order');

export default class Order extends Component {

    state = {
        orderId: '',
        quantity: '',
        menuItemName: '',
        itemId: '',
        orderDecription: ''
    };

    componentWillMount() {
        var order_id = sessionStorage.getItem('latestOrder');
        if (sessionStorage.getItem('latestOrder')) {
            this.fetchOrder(order_id);
            setTimeout(this.fetchOrderDetails.bind(this), 2000);
        }
    }

    fetchOrder = (order_id) => {
        RestClient.get(AppConfig.API.order.order(order_id))
            .then(response => {
                const data = response.data;
                logger.info(data);
                const quantity = data.menu_items[0].quantity;
                this.setState({
                    orderId: data.id,
                    quantity: quantity,
                    itemId: data.menu_items[0].id
                });
            })
            .catch(err => logger.error(err));
    }

    fetchOrderDetails() {
        var restaurant_id = sessionStorage.getItem('currentRestaurantId');
        var item_id = this.state.itemId;
        console.log('restaurant_id: ' + restaurant_id + ', item_id: ' + item_id);
        RestClient.get(AppConfig.API.restaurant.menu_item(restaurant_id, this.state.itemId))
        .then(response => {
            const data = response.data;
            logger.info(data);
            this.setState({
                menuItemName: data.name,
                orderDecription: data.description,
            });
        })
        .catch(err => logger.error(err));
    }

    render() {
        return (
            <ContentBlock>
                <h4>Your most recent order from {sessionStorage.getItem('currentRestaurant')} is below</h4>
                <List divided selection>
                    <List.Item>
                        <Label color="purple" horizontal>Order Id</Label>
                        {this.state.orderId}
                    </List.Item>
                    <List.Item>
                        <Label color="purple" horizontal>Item Name</Label>
                        {this.state.menuItemName}
                    </List.Item>
                    <List.Item>
                        <Label color="purple" horizontal>Quantity</Label>
                        {this.state.quantity}
                    </List.Item>
                    <List.Item>
                        <Label color="purple" horizontal>Item Description</Label>
                        {this.state.orderDecription}
                    </List.Item>
                </List>
            </ContentBlock>
        );
    }
}
