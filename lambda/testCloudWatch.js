exports.handler = (event, context, callback) => {
    console.log('LogScheduledEvent');
    console.log('Received event:', JSON.stringify(event, null, 2));
    
    var AWS = require('aws-sdk'),
    sqsQueueUrl = 'https://sqs.us-east-1.amazonaws.com/127151925153/testCloudWatchQueue',
    sqs;
    var sqs = new AWS.SQS({apiVersion: '2012-11-05'});
    var removeFromQueue = function(message) {
       sqs.deleteMessage({
          QueueUrl: sqsQueueUrl,
          ReceiptHandle: message.ReceiptHandle
       }, function(err, data) {
           if(err){
               console.log("try to delete fail");
           }
          err && console.log(err);
       });
    };

    sqs.receiveMessage({
       QueueUrl: sqsQueueUrl,
       MaxNumberOfMessages: 1, 
       VisibilityTimeout: 60, 
       WaitTimeSeconds: 3 
     }, function(err, data) {
       if (data.Messages) {
          var message = data.Messages[0],
              body = message.Body;
          console.log("Received message !!" + body); 
          removeFromQueue(message);  
       }
     });
 
    callback(null, 'Finished');
};