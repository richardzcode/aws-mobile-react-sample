/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

var DynamoStorage = function(dynamoDb) {
	this.dynamoDb = dynamoDb
}

DynamoStorage.prototype.findAll = function(table_name, callback) {
	// performs a DynamoDB Scan operation to extract all of the records in the table
	this.dynamoDb.scan({ TableName: table_name }, function(err, data) {
		if (!callback) {
			console.log('WARN: no callback in dynamo findAll')
			return
		}

		if (err) {
			callback(err)
		} else {
			callback(null, data['Items'])
		}
	})
}

DynamoStorage.prototype.find = function(table_name, id, callback) {
    var key = (typeof id === 'string')? {id: id} : id;
    console.log(key);
    this.dynamoDb.get({
        TableName: table_name,
        Key: key
    }, function(err, data) {
		if (!callback) {
			console.log('WARN: no callback in dynamo findAll')
			return
		}

        if (err) {
        	callback(err)
        } else {
        	callback(null, data['Item'])
        }
    })
}

DynamoStorage.prototype.findBy = function(table_name, conditions, callback) {
	var keyConditions = {}
	for (key in conditions) {
		keyConditions[key] = {
			ComparisonOperator: 'EQ',
			AttributeValueList: [conditions[key]]
		}
	}
    this.dynamoDb.query({
        TableName: table_name,
        KeyConditions: keyConditions
    }, function(err, data) {
		if (!callback) {
			console.log('WARN: no callback in dynamo findAll')
			return
		}

        if (err) {
        	callback(err)
        } else {
            callback(null, data['Items'])
        }
    })
}

DynamoStorage.prototype.create = function(table_name, data, callback) {
	this.dynamoDb.put({
		Item: data,
        TableName: table_name
    }, callback)
}

DynamoStorage.prototype.delete = function(table_name, id, callback) {
	this.dynamoDb.delete({
        TableName: table_name,
        Key: {
            id: id
        }
    }, function(err, data) {
		if (!callback) {
			console.log('WARN: no callback in dynamo delete')
			return
		}

        if (err) {
        	callback(err)
        } else {
            callback(null, data)
        }
	})
}

DynamoStorage.prototype.update = function(table_name, id, field_name, field_value, callback) {
	this.dynamoDb.update({
        TableName: table_name,
        Key: {
            id: id
        },
        UpdateExpression: 'SET ' + field_name + '=:field_value',
        ConditionExpression: 'id = :id',
        ExpressionAttributeValues: {
        	':id' : id,
        	':field_value': field_value
        }
	}, function(err, data) {
		if (!callback) {
			console.log('WARN: no callback in dynamo update')
			return
		}

        if (err) {
        	callback(err)
        } else {
            callback(null, data)
        }
	})
}

module.exports = DynamoStorage