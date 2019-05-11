# Yello

Kinda like Trello but... ya know... yellow

To run this app, clone and download the repo. You will need to have node >= 8.0 installed, as well as mongodb >= 3.6. Then, install the dependencies by running yarn, and create a .env file in the root of the project with the following keys:

NODE_ENV=DEVELOPMENT
MONGO_URL_TEST=(you can run the command mongo in a terminal and inspect the connected URL to get this value)
dbName=anything
JWT_SECRET=anything

If you run into an issue, try making sure that a mongo process is running with the command sudo service mongod start (linux)
