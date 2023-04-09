import { schedule } from 'node-cron';
import moment from 'moment';
import { run } from './parse';

export function runCron() {
  schedule(`10 * * * *`, async () => {
    console.log(`Cron job run at ${moment().format('YYYY-MM-DD HH:mm:ss')}`);
    run();
  });
}
