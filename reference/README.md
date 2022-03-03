# nusmoney sample backend with user authentication  
Sample Node.js backend for NUSmoney app, included Auth0 integration and sample data in lieu of database

## This repo consists of the files:  
**data.js**: sample data and functions to demonstrate data retrieval  
**main1.js**: demonstrates simple use of express to listen for and handle API requests  
**authdemo.js**: example code to use Auth0 to require a logged in user to make a request  
**.env_sample**: example configuration parameters you need to set in your .env file  
**main2.js**: more complex main program relying on functions in router.js  
**routers.js**: request handling requiring logged in user  
**Procfile**: required so Heroku knows which app to run on startup  
  
### You will need to create these files in your Node project:  
**.env**: a file similar to .env_sample containing the actual parameters for the application you registered in Auth0  
**.gitignore**: listing your .env file, node_modules folder and any other file or path you want to keep hidden from Github  
  
### In your Heroku app, you will need to set **Config vars (in Settings)**:  
**ISSUER_BASE_URL**: same as the value in your **.env** file (from your Auth0 application)  
**CLIENT_ID**: same as the value in your **.env** file (from your Auth0 application)  
**BASE_URL**: this needs to be the URL of your Heroku app (without port number)  
**SECRET**: same as the value in your **.env** file (from your Auth0 application)  
  
### In your Auth0 app, you will need to add the URL of your Heroku app:  
**Allowed Callback URLs**: in addition to the *http://localhost:3000/callback* URL you use when running locally, you need to add the URL of your Heroku app (e.g. *https://my-app.herokuapp.com/callback*, without port number). Separate the two URLs with a comma  
**Allowed Logout URLs**: in addition to the  *http://localhost:3000* URL you use when running locally, you need to add the URL of your Heroku app (e.g. *https://my-app.herokuapp.com*, without port number). Separate the two URLs with a comma  
