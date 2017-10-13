/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

import awsmobile from './aws-exports';

export default class AppConfig {}

AppConfig.CloudLogic = JSON.parse(awsmobile.aws_cloud_logic_custom)[0];
AppConfig.CloudLogic.enabled = awsmobile.aws_cloud_logic === 'enable';

AppConfig.API = {};
AppConfig.API.root = AppConfig.CloudLogic.endpoint + '/items';
AppConfig.API.restaurant = {
    root : AppConfig.API.root + '/restaurants',
    init: AppConfig.API.root + '/init',
    restaurant: function(restaurant_id) {
        return AppConfig.API.restaurant.root + '/' + restaurant_id;
    },
    menu: function(restaurant_id) {
        return AppConfig.API.restaurant.root + '/' + restaurant_id + '/menu';
    },
    menu_item: function(restaurant_id, item_id) {
        return AppConfig.API.restaurant.root + '/' + restaurant_id + '/menu/' + item_id;
    },
    cover: function(restauant_id) { return AppConfig.API.restaurant.root + '/' + restauant_id + '/cover'; }
};
AppConfig.API.order = {
    root: AppConfig.API.root + '/orders',
    order: function(order_id) { return AppConfig.API.order.root + '/' + order_id; }
};

AppConfig.Cognito = {
    identity_pool_id: awsmobile.aws_cognito_identity_pool_id,
    region: awsmobile.aws_cognito_region
};

AppConfig.ClouldFront = {
    enabled: awsmobile.aws_content_delivery_cloudfront === 'enable',
    bucket: awsmobile.aws_content_delivery_bucket,
    region: awsmobile.aws_content_delivery_region,
    domain: awsmobile.aws_content_delivery_cloudfront_domain
};

AppConfig.Dynamo = {
    enabled: awsmobile.aws_dynamodb === 'enable',
    all_tables_region: awsmobile.aws_dynamodb_all_tables_region,
    table_schemas: JSON.parse(awsmobile.aws_dynamodb_table_schemas)
};

AppConfig.Project = {
    id: awsmobile.aws_project_id,
    name: awsmobile.aws_project_name,
    region: awsmobile.aws_project_region
};

AppConfig.SignIn = {
    enabled: awsmobile.aws_sign_in_enabled === 'enable',
    mandatory: awsmobile.aws_mandatory_sign_in,
};

AppConfig.UserFiles = {
    enabled: awsmobile.aws_user_files === 'enable',
    bucket: awsmobile.aws_user_files_s3_bucket,
    region: awsmobile.aws_user_files_s3_region
};

AppConfig.UserPools = {
    enabled: awsmobile.aws_user_pools,
    id: awsmobile.aws_user_pools_id,
    mfa: awsmobile.aws_user_pools_mfa_type,
    web_client_id: awsmobile.aws_user_pools_web_client_id
};

AppConfig.UserSettings = {
    enabled: awsmobile.aws_user_settings === 'enable'
};

AppConfig.Analytics = {
    enabled: awsmobile.aws_app_analytics,
    app_id: awsmobile.aws_mobile_analytics_app_id
};