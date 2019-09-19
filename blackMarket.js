const mysql = require("mysql");
const keys = require("./keys");
const inquirer = require("inquirer");
var stock;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: keys.user,
    password: keys.password,
    database: "black_market_db"
});

const checkIfExit = (choice) => {
    if (choice === "q") {
        console.log("Goodbye");
        process.exit(0);
    }
}
const checkInventory = (itemId, inventory) => {
    for (i = inventory.length - 1; i >= 0; i--) {
        if (inventory[i].item_id === itemId) {
            return inventory[i];
        }
    }
    return null;
};

const submitOrder = (product, quantity) => {
    connection.query("UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?", [quantity, product.item_id], function (err, res) {
        if (err) throw err;
        console.log("\nOrder Placed:    " + quantity + " x " + product.product_name + "\n");
        inquirer.prompt([{
            name: "end",
            type: "list",
            message: "Is that all?",
            choices: ["I'd like to place another order", "Exit"]
        }]).then((ans) => {
            if (ans.end === "I'd like to place another order") {
                showStock();
            }
            else {
                console.log("Goodbye");
                process.exit(0);
            }
        })
    })
};

const promptCustomerForQuantity = (product) => {
    inquirer.prompt([{
        type: "input",
        name: "quantity",
        message: "How Many Would You Like to Buy?",
        validate: function (ans) {
            return ans > 0 || ans.toLowerCase(ans) === "q";
        }
    }]).then((ans) => {
        checkIfExit(ans.quantity);
        var quant = product.stock_quantity;
        if (quant <= 0) {
            console.log("item is out of stock");
            showStock();
        }
        else if (ans.quantity <= quant) {
            submitOrder(product, ans.quantity);
        }
        else {
            console.log("Insufficient Stock. Choose a lesser quantity.");
            promptCustomerForQuantity(product);
        }
    })
};

const promptId = function (inventory) {
    inquirer.prompt([{
        type: "input",
        name: "id",
        message: "Enter the ID of the product you would like to buy [Q to Quit]",
        validate: function (val) {
            return val > 0 || val.toLowerCase() === 'q'
        }
    },
    ]).then(function (ans) {
        checkIfExit(ans.id);
        var itemID = parseInt(ans.id);
        var product = checkInventory(itemID, inventory);
        console.log(product);
        if (product) {
            promptCustomerForQuantity(product)
        }
        else {
            console.log("\nThat item is not in the inventory");
            promptId();
        }
    })
};

var showStock = function () {
    connection.query(`SELECT * FROM products`, (err, res) => {
        if (err) throw err;
        stock = res;
        console.table(stock);
        // connection.end();
        promptId(stock);
    })
};
connection.connect(function (err, res) {
    if (err) throw err;
    showStock();
})

//     connection.connect(function (err, res) {
//     if (err) throw err;
//     connection.query(`SELECT * FROM products WHERE product_id=${answers.id}`, (error, response) => {
//         if (error) throw error;
//         if (parseInt(response.quantity) < 1) {
//             console.log("This Item Is Out Of Stock");
//             // }
//         }
//     })
// })
