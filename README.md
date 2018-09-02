# Fryd

Fryd is a gamification Plattform to reward users with trophies and let them compete.

## Example

This repository contains an example of a simple JavaScript app based on an express server.
It was generated using express-generator with the pug view engine. The fryd and passport-fryd packages are used to leverage the Fryd API.

The following dependencies were added:
+ winston for logging.
+ ioredis for caching
+ mongojs for database access
+ express-session and connect-redis for session handling
+ dotenv for process variables
+ passport and passport-fryd for authentication
+ fryd for easier access to the Fryd API

Before using it you have to create a developer account at Fryd and add a Trophy that the user should be awarded for creating an account.
Create a .env file in the root folder containing the needed environment variables:

```

MONGO_URI=mongodb://localhost:27017/<database>
REDIS=<leave empty for standard ioredis config>
CALLBACK_URL=<from Fryd developer dashboard>
FRYD_SECRET=<from Fryd developer dashboard>
FRYD_ID=<from Fryd developer dashboard>
LOCATION_ID=<from Fryd developer dashboard>
LOGIN_TROPY=< trophy key from Fryd developer dashboard>

```

Add

Clone the repository, `npm install` and `npm start`.

The app login should be available at http://localhost:3000.

After registering an account at https://fryd.zone/register users can login and are awarded a the login trophy for it.

TODO: add more functionality to showcase all of Fryd's functionality.
