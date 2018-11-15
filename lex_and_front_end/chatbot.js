'use strict';
console.log('Loading cahtbot function');

var AWS = require('aws-sdk');

exports.handler = function(event, context, callback) {
    let text;
    let session_attrs;
    if (event.body !== null && event.body !== undefined) {
        let body = JSON.parse(event.body)
        if (body.question !== undefined && body.question !== null && body.question !== "") {
            console.log("Received question: " + body.question);
            text = body.question;
        }
        /*
        if (body.session !== undefined && body.session !== null && body.session !== "") {
            console.log("Received session_attributes: " + body.session);
            session_attrs = body.session;
        }
        */
        session_attrs = body.session;
    }
    
    // Initialize the Amazon Cognito credentials provider
    
	AWS.config.region = 'us-east-2'; // Region
	AWS.config.credentials = new AWS.CognitoIdentityCredentials({
	// Provide your Pool Id here
		IdentityPoolId: 'us-east-2:08dab116-0fb9-4e57-96e0-b3422585cc52',
	});
	var lexruntime = new AWS.LexRuntime({region: 'us-east-1'});
	var lexUserId = 'chatbot-demo';
	// send it to the Lex runtime
	// send it to the Lex runtime
	var params = {
		botAlias: '$LATEST',
		botName: 'DiningSuggestion',
		inputText: text,
		userId: lexUserId,
		sessionAttributes: session_attrs
	};
	
	// send it to the Lex runtime
	lexruntime.postText(params, function(err, data) {
		if (err) {
			console.log(err, err.stack);
			let response = {
                statusCode: 200,
                headers: {
                    "x-custom-header" : "my custom header value",
                    "Access-Control-Allow-Origin" : "*",
                    "Access-Control-Allow-Methods" : "POST,GET",
                    "Access-Control-Allow-Headers" : "x-api-key"
                },
                body: JSON.stringify({
                    message : err,
                    sessionAttributes : null
                })
            };
			callback(err, response);
		}
		if (data) {
		    // capture the sessionAttributes for the next cycle
		    //session_attrs = data.sessionAttributes;
		    // show response and/or error/dialog status
		    let response = {
                statusCode: 200,
                headers: {
                    "x-custom-header" : "my custom header value",
                    "Access-Control-Allow-Origin" : "*",
                    "Access-Control-Allow-Methods" : "POST,GET",
                    "Access-Control-Allow-Headers" : "x-api-key"
                },
                body: JSON.stringify({
                    message : data,
                    sessionAttributes : data.sessionAttributes
                })
            };
			callback(null, response);
		}
	})
	
    // This is a simple illustration of app-specific logic to return the response. 
    // Although only 'event.queryStringParameters' are used here, other request data, 
    // such as 'event.headers', 'event.pathParameters', 'event.body', 'event.stageVariables', 
    // and 'event.requestContext' can be used to determine what response to return. 
    //
    
    // The output from a Lambda proxy integration must be 
    // of the following JSON object. The 'headers' property 
    // is for custom response headers in addition to standard 
    // ones. The 'body' property  must be a JSON string. For 
    // base64-encoded payload, you must also set the 'isBase64Encoded'
    // property to 'true'.
    /*
    var response = {
        statusCode: responseCode,
        headers: {
            "x-custom-header" : "my custom header value",
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods" : "POST,GET",
            "Access-Control-Allow-Headers" : "x-api-key"
        },
        body: JSON.stringify(responseBody)
    };
    console.log("response: " + JSON.stringify(response))
    callback(null, response);
    */
};