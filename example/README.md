# Datadog Lambda Timeout

The purpose of this stack is to reproduce the AWS Lambda timeouts we are
seeing with the Datadog Lambda Layer installed.

## Configuration

This stack assumes where is a secret stored in AWS Secrets Manager with the
name `datadog-api-key` that contains the Datadog API key.

## Architecture

This stack creates an EventBridge rule that will trigger the
`InvokerLambda` once every minute. The `InvokerLambda` will then invoke
the `TestLambda` once every 100ms (with some randomization). This
is enough traffic to reproduce the timeout issue we are seeing.

## Deploy

You can deploy this stack using the `npx cdk deploy` command.

## Temporarily Shutdown

To avoid too much cost, you can find the EventBridge rule in the AWS
console and disable it to stop the invocations without destroying the
whole stack.

## Timeout Reproduction

In our testing, the `TestLambda` lambda will start timing out within
2-3 hours of deploying this stack.
