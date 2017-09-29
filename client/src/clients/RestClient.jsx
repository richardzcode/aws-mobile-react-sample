/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

import axios from 'axios';
import Signer from '../utils/Signer';
import Logger from '../utils/Logger';

const logger = new Logger('RestClient');

function parseUrl(url) {
    var parts = url.split('/');
    logger.info(parts);

    return {
        host: parts[2],
        path: '/' + parts.slice(3).join('/')
    };
}

function ajax(url, method, data) {
    var parsed_url = parseUrl(url);

    logger.info(method + ' ' + url);

    var params = {
        method: method,
        url: url,
        host: parsed_url.host,
        path: parsed_url.path
    };

    params = {
        method: method,
        url: url,
        host: parsed_url.host,
        path: parsed_url.path
    };

    if (data) {
        params.headers = {'content-type': 'application/json'};
        params.data = data;
    }

    var credentials = sessionStorage.getItem('awsCredentials');
    return credentials? signed(params, JSON.parse(credentials)) : unsigned(params);
}

function get(url) {
    return ajax(url, 'GET');
}

function put(url, data) {
    return ajax(url, 'PUT', data);
}

function post(url, data) {
    return ajax(url, 'POST', data);
}

function delete_request(url) {
    return ajax(url, 'DELETE');
}

function head(url) {
    return ajax(url, 'HEAD');
}

function signed(params, credentials) {
    let signedParams = Signer.sign(params, {
        secret_key: credentials.secretAccessKey,
        access_key: credentials.accessKeyId,
        session_token: credentials.sessionToken
    });

    delete signedParams.headers['host'];
    delete signedParams.headers['Content-Length'];

    logger.info(signedParams);

    return axios(signedParams);
}

function unsigned(params) {
    return axios(params);
}

export default {
    ajax: ajax,
    get: get,
    put: put,
    post: post,
    delete: delete_request,
    head: head
};
