/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

import React, { Component } from 'react';
import AWS from 'aws-sdk';

import AppConfig from '../configuration/AppConfig';
import Logger from '../utils/Logger';

const logger = new Logger('S3Client');

logger.info(sessionStorage.getItem('identityId'));

AWS.config.update({
    region: AppConfig.UserFiles.region,
    credentials: JSON.parse(sessionStorage.getItem('awsCredentials'))
});

const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: {Bucket: AppConfig.UserFiles.bucket}
});

var path_params = function(path) {
	return {
        Bucket: AppConfig.UserFiles.bucket,
        Key: 'public' + path
	};
};

var head = function(path, callback) {
    var params = path_params(path);

    logger.info(params);

    s3.headObject(params, function(err, data) {
        if (callback) { callback(err, data); }
    });
};

var upload = function(path, file, meta, callback) {
    var params = path_params(path);
    params.Metadata = meta;
    params.Body = file;

    s3.upload(params, function(err, data) {
        if (err) {
            logger.error(err);
        }

        if (callback) { callback(err, data); }
    });
};

var presign = function(path, callback) {
	var params = path_params(path);
    params.Expires = 86400; // 1 day

    s3.getSignedUrl('getObject', params, function(err, url) {
        if (err) {
            logger.error(err);
        }

        if (callback) { callback(err, url); }
    });
};

export default {
	head: head,
    upload: upload,
    presign: presign
};