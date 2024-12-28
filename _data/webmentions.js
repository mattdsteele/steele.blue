import EleventyFetch from '@11ty/eleventy-fetch';
import { groupBy } from 'lodash-es';

const apiKey = process.env.WEBMENTION_IO_API;

const url = `https://webmention.io/api/mentions.jf2?token=${apiKey}&per-page=1000`;

export default async () => {
  const data = await EleventyFetch(url, { duration: '1d', type: 'json' });
  const grouped = groupBy(data.children, 'wm-target');
  const baseData = {};
  for (const key of Object.keys(grouped)) {
    baseData[content(key)] = grouped[key];
  }
  return baseData;
};
const content = url => {
    return new URL(url).pathname;
}