import { schedule } from 'node-cron';
import moment from 'moment';
import { run } from './parse';

let lastRun = 0;

export function runCron() {
  schedule(`10 * * * *`, async () => {
    if (lastRun !== +moment().format('HH')) {
      console.log(`Cron job run at ${moment().format('YYYY-MM-DD HH:mm:ss')}`);
      run();
      lastRun = +moment().format('HH');
    }
  });
}
