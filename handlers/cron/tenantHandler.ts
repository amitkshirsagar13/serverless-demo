import { Context, Handler, Callback } from 'aws-lambda';
import { SQS } from 'aws-sdk';
const sqs = new SQS({region:'eu-west-1'}); 

/**
 * @description handle some tank payload
 * @param event event object
 * @param context context object
 */
const runCron: Handler = async (event: any, context: Context, callback: Callback): Promise<any> => {
  const shot = {
    message: 'Boom!!! 💥 Boom!!! 💥',
    source: 'cron',
    exitCode: 0
  };
  var sqsParams = {
    MessageBody: JSON.stringify(shot),
    QueueUrl: 'http://localhost:4566/000000000000/dms-due-date-local-q'
  };
  var sqsdata = sqs.sendMessage(sqsParams, function(err, data) {
    if (err) {
      console.log('ERR', err);
    }
    console.log(data);
  });
  console.log('message sent');
  callback(undefined, { "statusCode" : 200, "body" : sqsdata});
};

export { runCron };