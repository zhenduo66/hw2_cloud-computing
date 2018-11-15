exports.handler = function(event, context,callback){
    // TODO implement
    
    var AWS = require('aws-sdk');
    AWS.config.region = 'us-east-1';
    var sns = new AWS.SNS();
    
    var params = {
      Message: 'this is a test message',
      MessageStructure: 'string',
      PhoneNumber: '+16469545512'
    };
    
    sns.publish(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
    });
    // const response = {
    //     statusCode: 200,
    //     body: JSON.stringify('Hello from Lambda!'),
    // };
    // return response;
};
