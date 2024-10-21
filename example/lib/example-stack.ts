import * as cdk from 'aws-cdk-lib';
import { Rule, Schedule } from 'aws-cdk-lib/aws-events';
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { Datadog } from 'datadog-cdk-constructs-v2';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';

export class ExampleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const testLambda = new NodejsFunction(this, 'TestLambda', {
      memorySize: 128,
      architecture: Architecture.ARM_64,
      runtime: Runtime.NODEJS_20_X,
      entry: 'src/test-lambda.ts',
      environment: {
        DD_EXTENSION_VERSION: 'next',
      },
    });

    const invokerLambda = new NodejsFunction(this, 'InvokerLambda', {
      memorySize: 128,
      architecture: Architecture.ARM_64,
      runtime: Runtime.NODEJS_20_X,
      entry: 'src/invoker.ts',
      timeout: cdk.Duration.minutes(2),
      environment: {
        TEST_LAMBDA_NAME: testLambda.functionName,
      },
    });
    testLambda.grantInvoke(invokerLambda);

    const apiKeySecret = Secret.fromSecretNameV2(this, 'datadog-api-key-secret', 'datadog-api-key');

    const datadog = new Datadog(this, 'DatadogLayer', {
      extensionLayerVersion: 63,
      nodeLayerVersion: 115,
      logLevel: 'debug',
      service: 'example-service',
      apiKeySecret: apiKeySecret,
    });
    datadog.addLambdaFunctions([testLambda]);

    const eventBridgeRule = new Rule(this, 'InvokeRule', {
      schedule: Schedule.cron({ minute: '*' }),
      targets: [new targets.LambdaFunction(invokerLambda)],
    });
  }
}
