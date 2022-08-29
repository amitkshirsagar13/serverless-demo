import { Context, Handler, Callback } from 'aws-lambda';
import AWS from 'aws-sdk';
const sqs = new AWS.SQS({region:'eu-west-1'}); 

/**
 * @description handle some tank payload
 * @param event event object
 * @param context context object
 */
const run: Handler = async (event: any, context: Context, callback: Callback): Promise<any> => {
  const shot = {
    message: 'Boom!!! 💥 Boom!!! 💥',
    event,
    exitCode: 0
  };
  callback(undefined, { "statusCode" : 200, "body" : shot});
};

export { run };