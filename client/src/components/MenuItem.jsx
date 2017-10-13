/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

import React, { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';

import AppConfig from '../configuration/AppConfig';
import RestClient from '../clients/RestClient';
import { SalesBook } from '../clients/AnalyticsClient';
import Logger from '../utils/Logger';

const logger = new Logger('MenuItem');

const order_book = new SalesBook('order');

export default class MenuItem extends Component {
    orderItem(restaurant_id, item) {
        order_book.record(item.name, 9.99, 1);
        
        let body = JSON.stringify({
            'restaurant_id': restaurant_id,
            'menu_items': [{
                'id': item.id,
                'quantity': 1
            }]
        });

        RestClient.post(AppConfig.API.order.root, body)
            .then(response => {
                sessionStorage.setItem('latestOrder', response.data.id);
                logger.info(response.data);
                alert('Ordered successfully');
            })
            .catch (err => logger.error(err));
    }

    render() {
        const restaurant_id = this.props.restaurantId
        const item = this.props.item

        return (
            <Table.Row key={item.id}>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.description}</Table.Cell>
                <Table.Cell>
                    <Button primary onClick={this.orderItem.bind(this, item.restaurant_id, item)}>Order</Button>
                </Table.Cell>
            </Table.Row>
        );
    }
}