const mysql = require("mysql");
const inquirer = require("inquirer");
const printTable = require("console.table");
const { addDepartment } = require("./addDepartment");

var connection = mysql.createConnection({
    host: "localhost",
    //your port;
    port:3306,

    //your user name
    user:"root",
    //your password
    password:"",
    database: "schema"
});

connection.connect(function(err) {
    if (err)throw err;
    runSearch();
});


function runSearch() {
    inquirer
      .prompt({
        name: "task",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "view employees",
          "view employee by department",
          "add employees",
          "remove employees",
          "update employee",
          "add role",
          "exit"]
      })
      .then(function(answer) {
        switch (task) {
        case "veiw employees":
          viewEmployee();
          break;
  
        case "view employee by department":
          viewEmployeeByDepartment();
          break;

          case "view employee by manger":
              viewEmployeeByManeger();
              break;
  
        case "add employee":
          addEmployee();
          break;
  
        case "remove employee":
          removeEmployee();
          break;
  
        case "update employee":
          updateEmployee();
          break;

          case "add role":
              addRole();
              break;
            
        case "exit":
            connection.end();
            break;

        }
      });
  }

// view employee
 function viewEmployee() {
    inquirer.prompt([
        {
            name: "employeeName",
            type: "list",
            message: "view employee",
            choices: employees.map(obj => obj.name)
        }
        .then(function(answer) {
            var query = "SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager"
            connection.query (query, { employee: answer.employee}, function(err, res) {
                if (err) throw err;
                for (var i =0; i < res.lenth; i++) {
                    console.table(res);
                 console.log("view employees\n");
                 firstPrompt();
                }
            })
            
    

// view employee by department
function viewEmployeeByDepartment() {
    inquirer.prompt([
        {
            name: "employeeName",
            type: "list",
            message: "view employee by department",
            choices: employees.map(obj => obj.name)
        }
        .then(function(answer) {
            var query = "SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager"
            connection.query (query, { employee: answer.employee}, function(err, res) {
                if (err) throw err;
                for (var i =0; i < res.lenth; i++) {
                    console.table(res);
                 console.log("Employees viewed by department!\n");
                 firstPrompt();
                }
            })

// viewed the employee by the manager
 function viewEmployeeByManager() {
    let employees = await db.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee');
    employees.push({ id: null, name: "Cancel" });
    let roles = await db.query('SELECT id, title FROM role');

    inquirer.prompt([
        {
            name: "manager",
            type: "list",
            message: "choose the employee",
            choices: employees.map(obj => obj.name)
        },
        {
            name: "employee role",
            type: "list",
            message: "view employee by manager",
            choices: roles.map(obj => obj.title)
        }
    ]).then(answers => {
        if (answers.empName != "Cancel") {
            let empID = employees.find(obj => obj.name === answers.empName).id
            let roleID = roles.find(obj => obj.title === answers.newRole).id
            db.query("UPDATE employee SET role_id=? WHERE id=?", [roleID, empID]);
            console.log("\x1b[32m", `${answers.empName} new role is ${answers.newRole}`);
        }
        runApp();
    })
};

// Add a new role to the database
async function addRole() {
    let departments = await db.query('SELECT id, name FROM department');

    inquirer.prompt([
        {
            name: "roleName",
            type: "input",
            message: "Enter new role title:",
            validate: confirmStringInput
        },
        {
            name: "salaryNum",
            type: "input",
            message: "Enter role's salary:",
            validate: input => {
                if (!isNaN(input)) {
                    return true;
                }
                return "Please enter a valid number."
            }
        },
        {
            name: "roleDepartment",
            type: "list",
            message: "Choose the role's department:",
            choices: departments.map(obj => obj.name)
        }
    ]).then(answers => {
        let depID = departments.find(obj => obj.name === answers.roleDepartment).id
        db.query("INSERT INTO role (title, salary, department_id) VALUES (?)", [[answers.roleName, answers.salaryNum, depID]]);
        console.log("\x1b[32m", `${answers.roleName} was added. Department: ${answers.roleDepartment}`);
        runApp();
    })
};

// Updates a role 
async function updateRole() {
    let roles = await db.query('SELECT id, title FROM role');
    roles.push({ id: null, title: "Cancel" });
    let departments = await db.query('SELECT id, name FROM department');

    inquirer.prompt([
        {
            name: "roleName",
            type: "list",
            message: "Update which role?",
            choices: roles.map(obj => obj.title)
        }
    ]).then(response => {
        if (response.roleName == "Cancel") {
            runApp();
            return;
        }
        inquirer.prompt([
            {
                name: "salaryNum",
                type: "input",
                message: "Enter role's salary:",
                validate: input => {
                    if (!isNaN(input)) {
                        return true;
                    }
                    return "Please enter a valid number."
                }
            },
            {
                name: "roleDepartment",
                type: "list",
                message: "Choose the role's department:",
                choices: departments.map(obj => obj.name)
            }
        ]).then(answers => {
            let depID = departments.find(obj => obj.name === answers.roleDepartment).id
            let roleID = roles.find(obj => obj.title === response.roleName).id
            db.query("UPDATE role SET title=?, salary=?, department_id=? WHERE id=?", [response.roleName, answers.salaryNum, depID, roleID]);
            console.log("\x1b[32m", `${response.roleName} was updated.`);
            runApp();
        })
    })
};

// Remove a role from the database
async function removeRole() {
    let roles = await db.query('SELECT id, title FROM role');
    roles.push({ id: null, title: "Cancel" });

    inquirer.prompt([
        {
            name: "roleName",
            type: "list",
            message: "Remove which role?",
            choices: roles.map(obj => obj.title)
        }
    ]).then(response => {
        if (response.roleName != "Cancel") {
            let noMoreRole = roles.find(obj => obj.title === response.roleName);
            db.query("DELETE FROM role WHERE id=?", noMoreRole.id);
            console.log("\x1b[32m", `${response.roleName} was removed. Please reassign associated employees.`);
        }
        runApp();
    })
};

// Add a new department to the database
async function addDepartment() {
    inquirer.prompt([
        {
            name: "depName",
            type: "input",
            message: "Enter new department:",
            validate: confirmStringInput
        }
    ]).then(answers => {
        db.query("INSERT INTO department (name) VALUES (?)", [answers.depName]);
        console.log("\x1b[32m", `${answers.depName} was added to departments.`);
        runApp();
    })
};

// Remove a department from the database
async function removeDepartment() {
    let departments = await db.query('SELECT id, name FROM department');
    departments.push({ id: null, name: "Cancel" });

    inquirer.prompt([
        {
            name: "depName",
            type: "list",
            message: "Remove which department?",
            choices: departments.map(obj => obj.name)
        }
    ]).then(response => {
        if (response.depName != "Cancel") {
            let uselessDepartment = departments.find(obj => obj.name === response.depName);
            db.query("DELETE FROM department WHERE id=?", uselessDepartment.id);
            console.log("\x1b[32m", `${response.depName} was removed. Please reassign associated roles.`);
        }
        runApp();
    })
};



exports.runApp = runApp;

console.log("_______  __   __  _______    _______  ______    _______  _______  ___   _  _______  ______\n|       ||  |_|  ||       |  |       ||    _ |  |   _   ||       ||   | | ||       ||    _ |\n|       ||       ||  _____|  |_     _||   | ||  |  |_|  ||       ||   |_| ||    ___||   | ||\n|       ||       || |_____     |   |  |   |_||_ |       ||       ||      _||   |___ |   |_||_ \n|      _||       ||_____  |    |   |  |    __  ||       ||      _||     |_ |    ___||    __  |\n|     |_ | ||_|| | _____| |    |   |  |   |  | ||   _   ||     |_ |    _  ||   |___ |   |  | |\n|_______||_|   |_||_______|    |___|  |___|  |_||__| |__||_______||___| |_||_______||___|  |_|\n\nVersion Almost\n");

runApp();
