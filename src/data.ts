import { Params } from './type';
import fs from 'fs';

export function getData() {
  const data = fs.readFileSync('./src/data/data.json', 'utf8');
  let params: Params;
  try {
    params = JSON.parse(data);
  } catch (e) {
    console.log(e);
    params = {
      queries: [],
      skus: [],
    };
  }
  return params;
}
