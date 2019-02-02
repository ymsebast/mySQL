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

function read(search) {
    if (search) { //read given category
        connection.query('SELECT * FROM products WHERE item_id=?', [search], function (error, results, fields) {
            if (error) throw error;
            for (var i = 0; i < results.length; i++) {
                console.log(`=======================================================================================\nitem_id: ${results[i].item_id} \nItem : ${results[i].product_name} \nDepartment name: ${results[i].department_name} \nPrice: ${results[i].price} \nStock Quantity : ${results[i].stock_quantity}`);
            }
        });
    }
    else {  //read all
        connection.query('SELECT * FROM products', function (error, results, fields) {
            if (error) throw error;
            for (var i = 0; i < results.length; i++) {
                console.log(`=======================================================================================\nitem_id: ${results[i].item_id} \nItem : ${results[i].product_name} \nDepartment name: ${results[i].department_name} \nPrice: ${results[i].price} \nStock Quantity : ${results[i].stock_quantity}`);
            }
        });
    }
    main();
}
//customer buys something
function subtractStock(id, newamount,amount) {
    connection.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?', [newamount, id], function (error, results, fields) {
        if (error) throw error;
        console.log(results);
        connection.query('SELECT price,stock_quantity FROM products WHERE item_id = ?', [id], function (error2, results2, fields) {
            if (error2) throw error2;
            console.log(results2[0].price);
            var sale = +results2[0].price * +amount;
            connection.query('UPDATE products SET product_sales = ? WHERE item_id = ?', [sale, id], function (error3, results3, fields) {
                if (error2) throw error2;
                console.log(results3)
            });
        });
        read();
    })
}
function checkStock(id, amount) {
    connection.query('SELECT stock_quantity,product_name FROM products WHERE item_id = ?', [id], function (error, results, fields) {
        if (error) throw error;
        console.log(results);
        if (amount > results[0].stock_quantity) {
            console.log(`There are only ${amount} ${results[0].product_name} left.`);
        }
        else {
            var newamount = results[0].stock_quantity - amount;
            console.log(`${amount} ${results[0].product_name} available. `);
            inquirer
                .prompt([
                    {
                        type: "confirm",
                        name: "confirm",
                        message: `Would you like to buy ${amount} ${results[0].product_name}?`
                    }
                ])
                .then(function (answers) {
                    subtractStock(id, newamount,amount);
                })
        }
    });
}
function main() {
    inquirer
        .prompt([
            {
                // Ask the user the ID of the product they would like to buy.
                name: "id",
                message: "Enter ID of product you would like to buy : "
            },
            {
                // Ask how many units of the product they would like to buy.
                name: "amount",
                message: "How many units of the product would you like to buy : "
            }
        ])
        .then(function (answers) {
            //check if stock of product is empty
            checkStock(answers.id, answers.amount);
        });

}

read();