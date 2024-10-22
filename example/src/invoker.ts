import { Handler } from 'aws-lambda';
import { setTimeout } from 'timers/promises';
import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';

const INTERVAL_MS = 100;
const NUM_INVOCATIONS = 60000 / INTERVAL_MS;

const lambda = new LambdaClient();

export const handler: Handler = async () => {
    console.log('Invoker triggered');
    for (let i = 0; i < NUM_INVOCATIONS; i++) {
        const jitter = Math.floor(Math.random() * 10) * (Math.random() < 0.5 ? -1 : 1);
        console.log(`Invocation ${i} (jitter: ${jitter}ms)`);
        await lambda.send(new InvokeCommand({
            FunctionName: process.env.TEST_LAMBDA_NAME!,
            InvocationType: 'Event',
            Payload: JSON.stringify({}),
        }));
        await setTimeout(INTERVAL_MS + jitter);
    }
}
