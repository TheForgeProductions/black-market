DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE black_market_db;

USE black_market_db;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(40) NOT NULL,
    department_name VARCHAR(25),
    price DECIMAL(10,2),
    stock_quantity INT,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("thing 1", "department one", 1.05, 5281);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("thing 3", "department three", 33.33, 333);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("low stock thing", "department one", 19.95, 1);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("out of stock thing", "department three", 72.27, 0);

SELECT * FROM products;

