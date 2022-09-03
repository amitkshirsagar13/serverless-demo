import { Context, Handler, Callback } from 'aws-lambda';

/**
 * @description handle some tank payload
 * @param event event object
 * @param context context object
 */
const handleEvent: Handler = async (event: any, context: Context): Promise<any> => {
  console.log("event", event);
  const jobId = event.pathParameters.id;
  console.log(`Process JobId[${jobId}] for deletion!!!`)
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      "action": "DELETE",
      "id": jobId,
      "status": "success"
    }),
  };
  return response;
};

export { handleEvent };