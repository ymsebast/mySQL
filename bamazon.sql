DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;
USE bamazon;

CREATE TABLE products (
  item_id INT auto_increment NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price INT NOT NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY (item_id)
);
INSERT INTO products (product_name,department_name,price,stock_quantity) VALUES ("Hat","Clothing","10","20");
INSERT INTO products (product_name,department_name,price,stock_quantity) VALUES ("Shoes","Clothing","20","15");
INSERT INTO products (product_name,department_name,price,stock_quantity) VALUES ("Bag","Clothing","40","25");
INSERT INTO products (product_name,department_name,price,stock_quantity) VALUES ("Shirt","Clothing","20","30");

INSERT INTO products (product_name,department_name,price,stock_quantity) VALUES ("Computer","Tech","1000","200");
INSERT INTO products (product_name,department_name,price,stock_quantity) VALUES ("Laptop","Tech","900","315");
INSERT INTO products (product_name,department_name,price,stock_quantity) VALUES ("XBox","Tech","500","125");
INSERT INTO products (product_name,department_name,price,stock_quantity) VALUES ("PS4","Tech","300","100");

CREATE TABLE departments(
	department_id INT auto_increment NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    overhead_costs INT NOT NULL,
    primary key (department_id)
);
ALTER TABLE products
ADD COLUMN product_sales INT;

INSERT INTO departments (department_name,overhead_costs) VALUES ("Clothing",200);
INSERT INTO departments (department_name,overhead_costs) VALUES ("Tech",200);

CREATE temporary table department Select department_name,SUM(product_sales)AS department_sales FROM products GROUP BY department_name;
SELECT * FROM departments INNER JOIN department where departments.department_name=department.department_name;

