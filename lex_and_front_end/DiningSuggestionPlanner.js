'use strict';
     
// Close dialog with the customer, reporting fulfillmentState of Failed or Fulfilled ("Thanks, your pizza will arrive in 20 minutes")
function close(sessionAttributes, fulfillmentState, message) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Close',
            fulfillmentState,
            message,
        },
    };
}
 
// --------------- Events -----------------------
 
function dispatch(intentRequest, callback) {
    console.log(`request received for userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.name}`);
    if(intentRequest.currentIntent.name == "DiningSuggestionIntent"){dispatch_dining(intentRequest, callback);}
    else if(intentRequest.currentIntent.name == "GreetingIntent"){dispatch_greets(intentRequest, callback);}
    else if(intentRequest.currentIntent.name == "ThankYouIntent"){dispatch_thanks(intentRequest, callback);}
}

function dispatch_dining(intentRequest, callback) {
    const sessionAttributes = intentRequest.sessionAttributes;
    const slots = intentRequest.currentIntent.slots;
    const cuisine = slots.Cuisine;
    const people = slots.People;
    const date = slots.Date;
    const time = slots.Time;
    const location = slots.Location;
    const phone = slots.Phone;
    
    var responseBody = {
        "Cuisine" : cuisine,
        "People" : people,
        "Dates" : date,
        "Time" : time,
        "Location" : location,
        "Phone" : phone
    };
    console.log( "Here is the raw JSON : "+ JSON.stringify(responseBody));
    SQS(JSON.stringify(responseBody));
    
    callback(close(sessionAttributes, 'Fulfilled',
    {'contentType': 'PlainText', 'content': 'Great'}));
    /*
    callback(close(sessionAttributes, 'Fulfilled',
    {'contentType': 'PlainText', 'content': `Great! The ${location} ${cuisine} restaurant suggestions for ${people} people, for ${date} at ${time} will be sent to your phone : ${phone}.`}));
    */
}

function SQS(message){
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
     MessageBody: message,
     QueueUrl: "https://sqs.us-east-1.amazonaws.com/077848684586/botqueue"
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
}

function dispatch_greets(intentRequest, callback){
    const sessionAttributes = intentRequest.sessionAttributes;
    callback(close(sessionAttributes, 'Fulfilled',
    {'contentType': 'PlainText', 'content': 'Hi there, how can I help?'}));
}

function dispatch_thanks(intentRequest, callback){
    const sessionAttributes = intentRequest.sessionAttributes;
    callback(close(sessionAttributes, 'Fulfilled',
    {'contentType': 'PlainText', 'content': 'You are welcome!'}));

}
 
// --------------- Main handler -----------------------
 
// Route the incoming request based on intent.
// The JSON body of the request is provided in the event slot.
exports.handler = (event, context, callback) => {
    try {
        dispatch(event,
            (response) => {
                callback(null, response);
            });
    } catch (err) {
        callback(err);
    }
};

