/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

import React, { Component } from 'react';

import S3Client from '../clients/S3Client';
import Logger from '../utils/Logger';

import amazon_logo from '../img/amazon_logo.png';

const logger = new Logger('PhotoUpload');

//const default_img_src = 'http://g-ec2.images-amazon.com/images/G/01/social/api-share/amazon_logo_500500._V323939215_.png';
const default_img_src = amazon_logo;

export default class PhotoUpload extends Component {
	constructor(props) {
		super(props);

		this.state = {
			ImgSrc: null,
            ObjectPath: props.ObjectPath
		};

        const that = this;
        const path = this.state.ObjectPath;
        S3Client.presign(path, function(err, url) {
            if (err) {
                that.state.ImgSrc = default_img_src;
            } else {
                that.state.ImgSrc = url;
            }
        });
	}

    handleImageError(e) {
        this.setState({ ImgSrc: default_img_src });
    }

    handleInput(e) {
        var that = this;

        const path = this.state.ObjectPath;
        const file = e.target.files[0];
        const type = file.type;

        S3Client.upload(path, file, {'Content-Type': type}, function(err, data) {
            if (err) {
                logger.log(err);
            } else {
                logger.log(data);
                S3Client.presign(path, function(err, url) {
                    that.setState({ ImgSrc: url });
                });
            }
        })
    }

	render() {
		return (
	        <div className="photo-upload-container">
	            <img src={this.state.ImgSrc} onError={(e) => this.handleImageError(e)} className="photo-upload-img" />
	            <input title="Upload Photo" type="file" accept="image/*" className="photo-upload-input"
	                onChange={(e) => this.handleInput(e)}
	            />
	        </div>
        )
	}
}