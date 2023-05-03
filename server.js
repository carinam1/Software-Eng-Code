const database = require("./database");
const userController = require("./modules/userController");
const paymentMethod = require("./modules/paymentMethod");
const healthMetrics = require("./modules/healthMetrics");
const energyLevel = require("./modules/energyLevel");
const jwt = require("jsonwebtoken");
const http = require("http");
const key = "PrivateKey1234";

// Middleware to parse JSON request bodies
function jsonBodyParser(req, res, next) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    req.body = JSON.parse(body);
    next();
  });
}

const checkAuthorization = (req, res) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader === "undefined") {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ Status: 401, message: "Unauthrized access" }));
    res.end();
  } else {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    try {
      return jwt.verify(req.token, key);
    } catch {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.write(
        JSON.stringify({
          Status: 401,
          Message: "Session expired! Please login",
        })
      );
      res.end();
    }
  }
};
database.pool
  .connect()
  .then(() => {
    console.log("Connected to database");
    return database.pool.query(database.dbSetupQuery);
  })
  .then(() => {
    console.log("Database setup succesfully.");
  })
  .catch((err) => {
    console.error("Error setting up database:", err);
  });

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
  res.setHeader('Access-Control-Max-Age', 2592000); // 30 days

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.write("Hello World!");
    res.end();
  } else if (req.url === "/users" && req.method === "GET") {
    checkAuthorization(req, res);
    userController.getUser(req, res);
  } else if (req.url === "/users" && req.method === "POST") {
    jsonBodyParser(req, res, () => {
      userController.createUser(req, res);
    });
  } else if (req.url === "/payment" && req.method === "GET") {
    paymentMethod.getPayment(req, res);
  } else if (req.url === "/payment" && req.method === "POST") {
    jsonBodyParser(req, res, () => {
      paymentMethod.createPayment(req, res);
    });
  } else if (req.url === "/metrics" && req.method === "GET") {
    healthMetrics.getMetrics(req, res);
  } else if (req.url === "/metrics" && req.method === "POST") {
    jsonBodyParser(req, res, () => {
      healthMetrics.createMetrics(req, res);
    });
  } else if (req.url === "/energy" && req.method === "GET") {
    energyLevel.getEnergy(req, res);
  } else if (req.url === "/energy" && req.method === "POST") {
    jsonBodyParser(req, res, () => {
      energyLevel.createEnergy(req, res);
    });
  } else if (req.url === "/login_verify" && req.method === "POST") {
    jsonBodyParser(req, res, () => {
      userController.loginVerify(req, res);
    });
  } else if (req.url === "/login_validate" && req.method === "POST") {
    console.log(req.url);
    jsonBodyParser(req, res, () => {
      userController.loginValidate(req, res);
    });
  } else {
    res.writeHead(405, headers);
    res.end(`${req.method} is not allowed for the request.`);
  }
  
});

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
