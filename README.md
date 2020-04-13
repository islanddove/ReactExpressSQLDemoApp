# ReactExpressSQLDemoApp

This is a React/Express application deployed on heroku at https://react-express-sql-demo-app.herokuapp.com/

server.js handles requests for resources, as well as serves up the React application.

## Testing
* This project uses Jest for testing both the client and api, with CI set up for the client tests via Github Actions.


## client

React client bootstrapped with create-react-app.
* React Redux for state management
* React Router for client-side routing
* Jest for a test runner. Run `npm test` in the client directory to run the client tests.

## api

Express api with postgres database.
* Uses ES6 modules and syntax
* Jest for a test runner. Run `npm test` in the api directory to run the api tests.
* NOTE - due to some issues with Jest and ES6 syntax, I do not currently have any api tests. This will change as I learn more about configuring Jest.
