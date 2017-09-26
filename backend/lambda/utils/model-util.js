/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

var ModelUtil = {}

ModelUtil.toDataList = function(model_list) {
	if (!model_list) { return null; }

	var list = []
	for (var i = 0; i < model_list.length; i++) {
		list.push(model_list[i].data)
	}

	return list
}

module.exports = ModelUtil