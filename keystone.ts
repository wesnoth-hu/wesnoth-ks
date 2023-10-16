// Welcome to Keystone!
//
// This file is what Keystone uses as the entry-point to your headless backend
//
// Keystone imports the default export of this file, expecting a Keystone configuration object
//   you can find out more at https://keystonejs.com/docs/apis/config

import { config } from '@keystone-6/core';
import type { ServerConfig } from '@keystone-6/core/types';

// to keep this file tidy, we define our schema in a different file
import { lists } from './schema';

// authentication is configured separately here too, but you might move this elsewhere
// when you write your list-level access control functions, as they typically rely on session data
import { withAuth, session } from './auth';

import dotenv from 'dotenv';

dotenv.config();

export default withAuth(
  config({
    db: {
      provider: 'mysql',
      url: `${process.env.DATABASE_URL}`,
    },
    lists,
    session,
    storage: {
      images: {
        // Images that use this store will be stored on the local machine
        kind: 'local',
        // This store is used for the image field type
        type: 'image',
        // The URL that is returned in the Keystone GraphQL API
        generateUrl: path => `${process.env.STORAGE_DOMAIN}/images${path}`,
        // The route that will be created in Keystone's backend to serve the images
        serverRoute: {
          path: '/images',
        },
        // Set serverRoute to null if you don't want a route to be created in Keystone
        // serverRoute: null
        storagePath: 'public/images',
      }
    },
    server: {
      cors: { origin: [`${process.env.NEXT_PUBLIC_INSTANCE}`], credentials: true },
      port: 3000,
    }
  })
);
