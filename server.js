const mysql = require("mysql2");
const inquirer = require("inquirer");

const PORT = process.env.PORT || 3001;

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'employee_tracker_db'
    },
    console.log('Welcome to the Employee Tracker app ')
)
db.connect(err => {
    if (err) throw err;
    console.log('Database connected');
    mainQuestion()
})

function mainQuestion() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'main',
            message: 'What would you like to do?',
            choices: ['View All', 'View Department', 'View Role', 'View Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employees Role', 'Done']
        },

    ]).then(answer => {
        if (answer.main === 'View All') {
            viewAll()
        } else if (answer.main === 'View Department') {
            viewDepartment()
        } else if (answer.main === 'View Role') {
            viewRole()
        } else if (answer.main === 'View Employees') {
            viewEmployees()
        } else if (answer.main === 'Add Department') {
            addDepartment()
        } else if (answer.main === 'Add Role') {
            addRole()
        } else if (answer.main === 'Add Employee') {
            addEmployee()
        } else if (answer.main === 'Update Employees Role') {
            updateEmployee()
        }
    })
}

function viewAll() {
    db.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;", (err, res) => {
        if (err) throw err;
        console.table(res);
        mainQuestion()
    })
}
function viewDepartment() {
    db.query("SELECT * FROM department;", (err, res) => {
        if (err) throw err;
        console.table(res);
        mainQuestion()
    })
}
function viewRole() {
    db.query("SELECT * FROM role;", (err, res) => {
        if (err) throw err;
        console.table(res);
        mainQuestion()
    })
}
function viewEmployees() {
    db.query("SELECT * FROM employee;", (err, res) => {
        if (err) throw err;
        console.table(res);
        mainQuestion()
    })
}

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'addDep',
            message: 'Enter new Department name?'
        }
    ]).then(function (res) {
        const department_name = res.addDep
        const query = `INSERT INTO department (name) VALUES ("${department_name}")`;
        db.query(query, function (err, res) {
            if (err) {
                throw err;
            }
            console.table(res);
            mainQuestion()
        })
    })


}

function addRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'roleTitle',
            message: "Add new role name!"
        },
        {
            type: 'input',
            name: 'roleSalary',
            message: 'Enter salary for the new role'
        },
        {
            type: 'input',
            name: 'roleDepartment',
            message: 'Enter department ID!'
        }
    ]).then(function (res) {
        const title = res.roleTitle
        const salary = res.roleSalary
        const department_id = res.roleDepartment

        const query = `INSERT INTO role (title, salary, department_id) VALUES ("${title}", "${salary}", "${department_id}")`;
        db.query(query, function (err, res) {
            if (err) {
                throw err;
            }
            console.table(res);
            mainQuestion()
        })
    })
}
function addEmployee() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'Employee first name?'
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Employee last name?'
        },
        {
            type: 'input',
            name: 'roleID',
            message: 'Employee role?'
        },
        {
            type: 'input',
            name: 'mangID',
            message: 'What is the first and last name of the manager of the new employee ?'
        },
    ]).then(function(res){
        const firstName = res.firstName
        const lastName = res.lastName
        const roleId = res.roleID
        const managerId = res.mangID
        const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${firstName}", "${lastName}", "${roleId}", "${managerId}")`;
        db.query(query, function (err, res){
            if(err){
                throw err;
            }
                console.table(res);
                mainQuestion()
        })
    })
}


function updateEmployee() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'employee',
            //remember id number for employee
            message: 'For the employee that you want to update, what their ID number?'
        },
        {
            type: 'input',
            name: 'role',
            //remember role id for employee
            message: 'What is the new role id number for this employee?'
        }
    ]).then(answer => {
        //updating employee table setting the role id = to answer.role where the id of the employee is = to answer.employee
        db.query('UPDATE employee SET ? WHERE ?',
            [
                {
                    role_id: answer.role
                },
                {
                    id: answer.employee
                }
            ]
        )
        console.log('employee updated');
        mainQuestion()
    })
}


