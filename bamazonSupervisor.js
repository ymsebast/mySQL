// Include node packages
var mysql = require("mysql");
var inquirer = require("inquirer");

//Connect to mysql and bamazon database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3307,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err
    console.log("Connected to mySQL with id:" + connection.threadId);
});

// View Product Sales by Department
function viewSales(dID) {
    // total_profit column calculated using the difference between over_head_costs and product_sales
    var total_profit;
    connection.query('CREATE temporary table department Select department_name,SUM(product_sales)AS department_sales FROM products GROUP BY department_name', function (error, results, fields) {
        if (error) throw error
        connection.query("SELECT * FROM departments INNER JOIN department where departments.department_name = department.department_name", function (error2, results2, field) {
            if (error2) throw error2
            for (var i = 0; i < results2.length; i++) {
                total_profit = +results2[i].department_sales - +results2[i].overhead_costs;
                console.log(`=======================================================================================\ndepartment_id: ${results2[i].department_id} \ndepartment_name: ${results2[i].department_name} \nDepartment sales: ${results2[i].department_sales} \nOverhead Costs: ${results2[i].overhead_costs} \nTotal profit : ${total_profit}`);
            }
        });
    });
}
// Create New Department
function newDep(name, costs) {
    connection.query('INSERT INTO departments (department_name,overhead_costs) VALUES (?,?)', [name, costs], function (error2, results2, fields) {
        if (error2) throw error2;
        connection.query('SELECT * FROM departments', function (error, results, fields) {
            for (var i = 0; i < results.length; i++) {
                console.log(`=======================================================================================\ndepartment_id: ${results[i].department_id} \nName : ${results[i].department_name} \nOVerhead Costs: ${results[i].overhead_costs}`);
            }
        });
    });
}

inquirer
    .prompt([
        {
            message: "What would you like to do?",
            name: "function",
            type: "list",
            choices: ["View Sales by Department", "Add to Department"]
        }
    ]).then(function (answers) {
        if (answers.function == "View Sales by Department") {
            viewSales();
        }
        else if (answers.function == "Add to Department") {
            inquirer
                .prompt([
                    {
                        message: "What would you like to name the new department?",
                        name: "name"
                    },
                    {
                        message: "What is the overhead cost of the department?",
                        name: "cost"
                    }
                ])
                .then(function (answers) {
                    newDep(answers.name,answers.cost);

                })
        }
    })