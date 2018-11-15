exports.handler = function(event, context,callback){
    // Load the SDK for JavaScript
    var AWS = require('aws-sdk');
    // Set the region 
    AWS.config.update({region: 'us-east-1'});
    var sqs = new AWS.SQS({apiVersion: '2012-11-05'});
    
    
    var params = {
     DelaySeconds: 1,
     MessageAttributes: {
      "Title": {
        DataType: "String",
        StringValue: "The Whistler"
       },
      "Author": {
        DataType: "String",
        StringValue: "John Grisham"
       },
      "WeeksOn": {
        DataType: "Number",
        StringValue: "6"
       }
     },
     MessageBody: "test Messge 4",
     QueueUrl: "https://sqs.us-east-1.amazonaws.com/127151925153/testWriteQueue"
    };
    
    sqs.sendMessage(params, function(err, data) {
        console.log("in the callback func");
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data.MessageId);
      }
    });
    // TODO implement
    // const response = {
    //     statusCode: 200,
    //     body: JSON.stringify('Hello from Lambda!'),
    // };
    // return response;
};
