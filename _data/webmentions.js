import EleventyFetch from '@11ty/eleventy-fetch';
import { groupBy } from 'lodash-es';

import {readFileSync} from 'node:fs';
const wm1 = JSON.parse(readFileSync('_data/webmention-1.json'));

const apiKey = process.env.WEBMENTION_IO_API;

const url = `https://webmention.io/api/mentions.jf2?token=${apiKey}&per-page=1000`;

export default async () => {
  // This first set of data is from a lost webmention.io account
  const data = wm1;

  // Then, concat it with the current webmention.io account
  const wmData = await EleventyFetch(url, { duration: '1d', type: 'json' });
  const allWms = wmData.children.concat(data.children);

  const grouped = groupBy(allWms, 'wm-target');
  const baseData = {};
  for (const key of Object.keys(grouped)) {
    baseData[content(key)] = grouped[key];
  }
  return baseData;
};
const content = url => {
    return new URL(url).pathname;
}