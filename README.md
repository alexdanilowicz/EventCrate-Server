# Node API Starter Kit

A starter kit for making an API built on Node, Express, and Mongoose. Supports ECMA 6, and configured to deploy on Heroku.

### Setup

Open terminal, and go to desired file location.

First, ensure you have Node installed.

Clone the repo to local machine:

```
git clone https://github.com/Teddarific/Node-API-Starter.git
```

Switch into the repository:

```
cd Node-API-Starter
```

Install the dependencies:

```
npm install
```

### Running the Server Locally

To run the server locally:

```
npm start
```

To enable hot reloading, ensure that you have ```Nodemon``` installed globally through
```
npm install -g nodemon
```

Start the server locally with hot reloading:

```
nodemon --exec npm start
```

### Connecting to a Database

This API utilizes a MongoDB through Mongoose. If not set up, the server will default to a local DB with the URI as ```mongodb://localhost/testdev```.

To connect to a separate hosted database, create a ```.env``` file within the directory and enter the following relevant information:

```
DB_USERNAME=JohnDoe
DB_PASSWORD=abcde12345
DB_PORT=9000
DB_DATABASE=Prod
```

The server will then attempt to connect with the following URI:

```
mongodb://DB_USERNAME:DB_PASSWORD@host:DB_PORT/DB_DATABSE
```
