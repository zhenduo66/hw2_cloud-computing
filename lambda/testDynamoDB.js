const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region:"us-east-1"});
exports.handler = function(event, context, callback){
    
    var params = {
      TableName: 'testTable',
      Item: {
          name: "twj2"
      }
    };
    
    
    docClient.put(params,function(err,data){
        console.log("in the put function");
        if(err){
            console.log("error occur!");
            callback(err,null);
        }
        else{
            console.log("succeed");
            callback(null,data);
        }
    });
};
