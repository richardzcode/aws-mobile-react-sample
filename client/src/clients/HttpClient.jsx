/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

import axios from 'axios';
import aws4 from 'aws4';
import Logger from '../utils/Logger';

const logger = new Logger('HttpClient');

function parseUrl(url) {
    var parts = url.split('/');
    logger.info(parts);

    return {
        host: parts[2],
        path: '/' + parts.slice(3).join('/')
    };
}

function ajax(url, method, body) {
    var parsed_url = parseUrl(url);

    logger.info(method + ' ' + url);

    var params = {
        method: method,
        url: url,
        host: parsed_url.host,
        path: parsed_url.path
    }

    if (body) {
        params.headers = {'content-type': 'application/json'}
        params.body = body;
    }

    var credentials = sessionStorage.getItem('awsCredentials')
    return credentials? signed(params, body, JSON.parse(credentials)) : unsigned(params)
}

function get(url) {
    return ajax(url, 'GET');
}

function put(url, body) {
    return ajax(url, 'PUT', body);
}

function post(url, body) {
    return ajax(url, 'POST', body);
}

function signed(params, body, credentials) {
    let signedParams = aws4.sign(
        params,
        {
            secretAccessKey: credentials.secretAccessKey,
            accessKeyId: credentials.accessKeyId,
            sessionToken: credentials.sessionToken
        }
    )

    delete signedParams.headers['Host']
    delete signedParams.headers['Content-Length']

    signedParams.data = signedParams.body

    console.log(signedParams)

    return axios(signedParams);
}

function unsigned(params) {
    return axios(params)
}

export default {
    ajax: ajax,
    get: get,
    put: put,
    post: post
}
