import { Handler } from 'aws-lambda';
import { setTimeout } from 'timers/promises';

export const handler: Handler = async () => {
    console.log('Test Lambda triggered');
    await setTimeout(100 + getJitter());
    console.log('Step 1');
    await setTimeout(100 + getJitter());
    console.log('Step 2');
    await setTimeout(100 + getJitter());
    console.log('Step 2');
}

function getJitter() {
    return Math.floor(Math.random() * 10) * (Math.random() < 0.5 ? -1 : 1);
}
