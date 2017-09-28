/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

var AWS = require('aws-sdk');

AWS.config.update({ region: process.env.REGION });

var S3Storage = function(s3) {
    this.s3 = s3
}

S3Storage.prototype.test = function(callback) {
    var params = {
        Bucket: "reactsample-userfiles-mobilehub-1318655916",
        Key: "public/example-image.png"
    };

    this.s3.getObject(params, function(err, data) {
        if (err) {
            callback(err)
        } else {
            callback(null, data)
        }
    });
}

S3Storage.prototype.presign = function(path, callback) {
    var params = {
        Bucket: "reactsample-userfiles-mobilehub-1318655916",
        Key: path,
        Expires: 144000
    };

    this.s3.getSignedUrl('getObject', params, function(err, url) {
        if (err) {
            console.log(err);
        } else {
            console.log(url);
        }

        callback(err, url);
    });
}

S3Storage.prototype.get = function(path, callback) {
    var params = {
        Bucket: "reactsample-userfiles-mobilehub-1318655916",
        Key: path
    };

    var url = this.s3.getObject(params, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
        }
    });
}

S3Storage.prototype.put = function(path, data, meta, callback) {
    var params = {
        ACL: 'public-read',
        Bucket: "reactsample-userfiles-mobilehub-1318655916",
        Key: path,
        Metadata: meta,
        Body: data
    };

    var that = this;
    this.s3.putObject(params, function(err, data) {
        if (err) {
            callback(err)
        } else {
            callback(null, data)
        }
    });
}

S3Storage.prototype.upload = function(path, data, meta, callback) {
    var params = {
        ACL: 'public-read',
        Bucket: "reactsample-userfiles-mobilehub-1318655916",
        Key: path,
        Metadata: meta,
        Body: data
    };

    this.s3.upload(params, function(err, data) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            console.log(data);
            callback(null, data);
        }
    });
}

module.exports = S3Storage