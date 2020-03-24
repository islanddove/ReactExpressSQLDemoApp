# ReactExpressSQLDemoApp

This is a React/Express application deployed on heroku at https://react-express-sql-demo-app.herokuapp.com/

The file server.js is the lynchpin of this project. When deployed, it handles requests for resources, as well as serves up the React application.

## Testing
* This project uses Jest


## client

React client bootstrapped with create-react-app.
* React Redux for state management
* React Router for client-side routing
* Jest for a test runner. Run `npm test` in the client directory to run the client tests.

## api

Express api with postgres database.
* Uses ES6 modules and syntax
* Jest for a test runner. Run `npm test` in the api directory to run the api tests.
