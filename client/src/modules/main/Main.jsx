/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Switch, Redirect } from 'react-router-dom';
import { Button, Card, Row, Col, Navbar, NavItem } from 'react-materialize';

import AppRoute from '../../index';
import Home from './Home';
import Menu from './Menu';
import Orders from './Order';
import Login from '../auth/Login';
import {handleSignOut} from '../auth/auth';

import '../../css/general.css';

export default class Main extends Component {

    state = {
        logOut: false
    }

    signOut = (e) => {
        e.preventDefault();
        handleSignOut();

        this.setState({
            logOut: true
        });
    }

    render() {
        const { logOut } = this.state;
        return (
            <div>
                {
                    !logOut && (
                    <BrowserRouter>
                        <div>
                            <Navbar className='nav-bar' brand='WebApp' right>
                                <NavItem><Link to="/main/home">Home</Link></NavItem>
                                <NavItem><Link to="/main/menus">Menu</Link></NavItem>
                                <NavItem><Link to="/main/orders">Orders</Link></NavItem>
                                <NavItem onClick={this.signOut}>Logout</NavItem>
                            </Navbar>
                            <div className="content">
                                <h2>Serverless Restaurants App</h2>
                                <h4>Welcome to the order system!</h4>
                            </div>
                            <Switch>
                                <Route exact path="/main" component={Home} />
                                <Route exact path="/main/home" component={Home} />
                                <Route exact path="/main/menus/:id" component={Menu} />
                                <Route exact path="/main/menus" component={Menu} />
                                <Route exact path="/main/orders" component={Orders} />
                            </Switch>
                        </div>
                    </BrowserRouter>)
                }
                {
                    logOut && (<AppRoute authStatus={false}/>)
                }
            </div>
        );
    }
}
