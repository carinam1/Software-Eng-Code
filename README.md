# Software-Eng-Code

## Database Setup

1. The backend is setup to connect with a PostgreSQL database running on your computer. If you're on Mac/Linux and have docker installed, running the `setup_docker.sh` file in the /db folder will do everything for you.
2. Otherwise, follow a guide for installing PostgreSQL on your computer (it's just a few steps). Then, create a database with the following info:
Database Name: postgres
Username: postgres
Password: password
Port: 5432 (this should be the default)

^ That info is defined in the `server.js` file, so if you use different info, the backend won't be able to connect to the database.


## Backend Setup

1. Make sure you have [Node](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) installed.
2. Navigate to the /backend folder inside this project in your command-prompt/terminal and run `npm install`. This will install all the dependencies to run the project.
3. Inside the /backend folder, run `node server.js` to start running the server. 

## How this works

First, the server connects to our database and creates any tables we need if they don't already exist.
```
database.pool.connect()
  .then(() => {
    console.log('Connected to database');
    return database.query(dbSetupQuery);
  })

```
`dbSetupQuery` is defined in `/backend/database.js`. It's a string with it's value set to the SQL query to create our tables. We import the string into this file using `require()` with the filename in the parenthesis (without the .js extension). 

Now that we are sure we are connected to our database, we can start our server.
```
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
```
This runs our server on port 3000 of our computer. 

For actually interacting with the server, that's where the `app.get`, `app.post`, `app.put`, and `app.delete` functions come in. These functions, along with a route represent the server receiving a **request**. Based on the URL and the data it receives, it decides what to do. 
### Modules

In the modules folder, there is a file called `userController.js`. This is an example of a "module" of similar functions. We can create modules to group related functions so they're not all in one big file.

Once we create a module, the functions it contains need to be exported (see `userController.js`) so we can assign a route to them in our main server file (`server.js`):
```
module.exports = {
    createUser,
    getUser
}
```

Then, in `server.js`, we need to import the module we created.
```
const userController = require('./modules/userController');
```

Now, we can access any of our functions in our module using userController.NAMEofFUNCTION().

We can now assign routes to reach a function in our module by doing the following:
```
app.post('/users', function(req, res){
    userController.createUser(req, res);
});
```
Where post is the type of request (ex: get, post, put, delete) and '/users' is the path. So, if the URL for our backend API was nuyu.com/api, this route would be reached by nuyu.com/api/users. `function(req, res) { userController.createUser(req, res); }` defines what function we are using to handle this request. In this case, it's the createUser() function in our userController module, which we imported using the require statement previously. 

This same functionality can be easily expanded to all the modules we create to easily have a function in a module be triggered by a request to any path.

