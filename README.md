# Serverless Framework Node Scheduled Cron on AWS

This template demonstrates how to develop and deploy a simple cron-like service running on AWS Lambda using the traditional Serverless Framework.

## Schedule event type

This examples defines two functions, `cron` and `secondCron`, both of which are triggered by an event of `schedule` type, which is used for configuring functions to be executed at specific time or in specific intervals. For detailed information about `schedule` event, please refer to corresponding section of Serverless [docs](https://serverless.com/framework/docs/providers/aws/events/schedule/).

When defining `schedule` events, we need to use `rate` or `cron` expression syntax.

### Rate expressions syntax

```pseudo
rate(value unit)
```

`value` - A positive number

`unit` - The unit of time. ( minute | minutes | hour | hours | day | days )

In below example, we use `rate` syntax to define `schedule` event that will trigger our `rateHandler` function every minute

```yml
functions:
  tenantCronEvent:
    handler: handlers/cron/tenantHandler.run
    events:
      - schedule: schedule: cron(0 * * * ? *)

  tenantMessageReceiveEvent:
    handler: handlers/sqs/tenantHandler.run
    events:
      - sqs: arn:aws:sqs:eu-west-1:000000000000:tenant-tasks
```

### Cron expressions syntax

```pseudo
cron(Minutes Hours Day-of-month Month Day-of-week Year)
```

All fields are required and time zone is UTC only.

| Field         | Values         | Wildcards     |
| ------------- |:--------------:|:-------------:|
| Minutes       | 0-59           | , - * /       |
| Hours         | 0-23           | , - * /       |
| Day-of-month  | 1-31           | , - * ? / L W |
| Month         | 1-12 or JAN-DEC| , - * /       |
| Day-of-week   | 1-7 or SUN-SAT | , - * ? / L # |
| Year          | 192199      | , - * /       |

In below example, we use `cron` syntax to define `schedule` event that will trigger our `cronHandler` function every second minute every Monday through Friday

### DMS setup of the serverless infrastructure together
```

aws --endpoint-url=http://localhost:4566 sqs list-queues
aws --endpoint-url=http://localhost:4566 lambda list-event-source-mappings
aws --endpoint-url=http://localhost:4566 events list-rules
aws --endpoint-url=http://localhost:4566 events list-targets-by-rule --rule  <rulename>
aws --endpoint-url=http://localhost:4566 lambda list-functions

# Optional if not already created, create queue and event source mapping
aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name dms-due-date-local-q
aws --endpoint-url=http://localhost:4566 lambda create-event-source-mapping --function-name dueDateTenantMessageReceiveEvent --batch-size 1 --event-source-arn arn:aws:sqs:eu-west-1:000000000000:dms-due-date-local-q

aws --endpoint-url=http://localhost:4566 sqs send-message --queue-url http://localhost:4566/000000000000/dms-due-date-local-q --message-body file://data.json


serverless deploy --stage local
serverless invoke local -f tenantCronEvent --path data.json
serverless info
serverless deploy list
serverless metrics
serverless logs --function tenantCronEvent --tail

# Optional

aws --endpoint-url=http://localhost:4566 events put-rule --name tenantCronEvent --schedule-expression "cron(*/2 * * * ? *)"
aws --endpoint-url=http://localhost:4566 events describe-rule --name CronJobTrigger
aws --endpoint-url=http://localhost:4566 events enable-rule --name CronJobTrigger

aws --endpoint-url=http://localhost:4566 iam create-role \
    --role-name tenant-trigger \
    --assume-role-policy-document '{"Version": "2012-10-17", "Statement": [{"Effect": "Allow", "Action": ["lambda:InvokeFunction"]}, {"Effect": "Allow", "Action": ["sqs:SendMessage", "sqs:ReceiveMessage", "sqs:DeleteMessage", "sqs:GetQueueAttributes"]}]}'
```
