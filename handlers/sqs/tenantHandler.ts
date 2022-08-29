import { Context, Handler, Callback } from 'aws-lambda';

/**
 * @description handle some tank payload
 * @param event event object
 * @param context context object
 */
const handleEventMessage: Handler = async (event: any, context: Context, callback: Callback): Promise<any> => {
  const shot = {
    message: 'Boom!!! 💥 Boom!!! 💥',
    event,
    exitCode: 0
  };
  callback(undefined, { "statusCode" : 200, "body" : shot});
};

export { handleEventMessage };