import { getData } from './data';
import { Result, SaveResult } from './type';
import axios from 'axios';
import moment from 'moment';
import translitRusEng from 'translit-rus-eng';
import fs from 'fs';

const defaultParams = {
  page: 1,
  sort: 'popular',
  query: '',
  curr: 'rub',
  spp: 0,
  regions:
    '80,64,38,4,115,83,33,68,70,69,30,86,75,40,1,66,48,110,31,22,71,114,111',
  dest: '-1257786',
  resultset: 'catalog',
  suppressSpellcheck: false,
};

let page = 1;

let result: Result = {};

const findOnPage = async (page: number, query: string, skus: number[]) => {
  const params = { ...defaultParams, page, query };
  const { data } = await axios.get(
    'https://search.wb.ru/exactmatch/ru/common/v4/search',
    { params }
  );

  if (!data || !data.data || !data.data.products) {
    return false;
  }

  data.data.products.forEach((item: { id: number }, index: number) => {
    if (skus.includes(item.id)) {
      result[item.id] = {
        page: page,
        pos: index + 1 + (page - 1) * 100,
      };
    }
  });
  console.log(
    `Scan page ${page} for ${query} completed, found ${
      Object.keys(result).length
    } items`
  );
  return data.data.products.length > 0;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const save = (query: string, result: Result) => {
  const fileName = `${translitRusEng(query, { slug: true })}.json`;
  const filePath = `./src/results/${fileName}`;
  let data: SaveResult = {};
  if (fs.existsSync(filePath)) {
    let buf = fs.readFileSync(filePath, 'utf8');
    data = JSON.parse(buf);
  }
  Object.keys(result).forEach((key) => {
    if (!data[key]) {
      data[key] = {};
    }
    data[key][moment().format('YYYY-MM-DD_HH')] = {
      pos: result[key].pos,
      page: result[key].page,
      date: moment().format('YYYY-MM-DD HH:mm:ss'),
    };
  });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

export async function parseForQueries(queries: string[], skus: number[]) {
  for (let query of queries) {
    result = {};
    page = 1;
    while (Object.keys(result).length !== skus.length) {
      try {
        const res = await findOnPage(page, query, skus);
        if (!res) {
          break;
        }
      } catch (e) {
        console.log(e);
      }
      await sleep(1500);
      page++;
    }

    console.log(JSON.stringify(result, null, 2));
    save(query, result);
  }
}

export async function run() {
  const params = getData();
  await parseForQueries(params.queries, params.skus);
}
