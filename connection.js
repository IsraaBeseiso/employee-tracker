const mysql = require("mysql");
const inquirer = require("inquirer");
var connection = mysql.createConnection({
  host: "localhost",
  //your port;
  port:3306,

  //your user name
  user:"root",
  //your password
  password:"rootroot",
  database: "employee_trakerDB"
});

connection.connect(function(err) {
  if (err)throw err;
  console.log("connected as id " + connection.threadId);
  connection.end();
});
