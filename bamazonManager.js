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

// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.

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
}

// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
function viewLow(){
    connection.query('SELECT * FROM products WHERE stock_quantity < 5', function (error, results, fields) {
        if (error) throw error;
        for (var i = 0; i < results.length; i++) {
            console.log(`=======================================================================================\nitem_id: ${results[i].item_id} \nItem : ${results[i].product_name} \nDepartment name: ${results[i].department_name} \nPrice: ${results[i].price} \nStock Quantity : ${results[i].stock_quantity}`);
        }
    });
}

// If a manager selects Add to Inventory, display a prompt that will let the manager "add more" of any item currently in the store.
function addInventory(){
    inquirer
    .prompt([
        {
            message:"Enter item ID of item to add more to : ",
            name:"id"
        },
        {
            message:"How much more would you like to add to that stock? ",
            name:"add"
        }
    ]).then(function(answers){
        connection.query('SELECT stock_quantity FROM products WHERE item_id = ?', [answers.id], function (error, results, fields) {
            if (error) throw error;
            var newStock = +results[0].stock_quantity + +answers.add;
            connection.query('UPDATE products SET stock_quantity=? WHERE item_id=?', [newStock,answers.id], function (error2, results2, fields) {
                if (error2) throw error2;
                for (var i = 0; i < results2.length; i++) {
                    console.log(`=======================================================================================\nitem_id: ${results[i].item_id} \nItem : ${results[i].product_name} \nDepartment name: ${results[i].department_name} \nPrice: ${results[i].price} \nStock Quantity : ${results[i].stock_quantity}`);
                }
                read();
            });
        });
        

    })
}

// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.
function addProduct(){
    inquirer
    .prompt([
        {
            message: "Enter new Product name : ",
            name: "name"
        },
        {
            message: "Enter new Product department :",
            name: "department"
        },
        {
            message:"Enter new Product price : ",
            name:"price"
        },
        {
            message:"Enter new Product stock quantity : ",
            name:"stock"
        }
    ]).then(function(answers){
        connection.query('INSERT INTO products (product_name,department_name,price,stock_quantity) VALUES (?,?,?,?)', [answers.name, answers.department, answers.price, answers.stock], function (error, results, fields) {
            if (error) throw error;
            console.log(results);
        });
    })
}

inquirer
.prompt([
    {
        message: "What would you like to do?",
        name:"function",
        type: "list",
        choices: ["View Products for Sale", "View Low Inventory","Add to Inventory","Add New Products"]
    }
]).then(function(answers){
    if(answers.function == "View Products for Sale"){
        read();
    }
    else if(answers.function == "View Low Inventory"){
        viewLow();
    }
    else if(answers.function == "Add to Inventory"){
        addInventory();
    }else if(answers.function == "Add New Products"){
        addProduct();

    }
})