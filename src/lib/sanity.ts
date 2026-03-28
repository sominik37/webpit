import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: 'pddoyk9z',
  dataset: 'production',
  useCdn: false, // Turned off to ensure fresh data immediately
  apiVersion: '2023-05-03', // use a current UTC date to see freshest API version
});

const builder = imageUrlBuilder(client);

export const urlFor = (source: any) => {
  return builder.image(source);
};
