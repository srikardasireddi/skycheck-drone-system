/* SkyCheck Supply Chain Management
   Task 02: Database Schema & Queries
*/

-- 1. DATABASE & TABLE CREATION
CREATE DATABASE IF NOT EXISTS skycheck_supply_db;
USE skycheck_supply_db;

-- Customer Table
CREATE TABLE Customer (
    CustomerID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Phone VARCHAR(20),
    Address TEXT
);

-- Product Table
CREATE TABLE Product (
    ProductID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Description TEXT,
    Price DECIMAL(10, 2) NOT NULL
);

-- Order Table
CREATE TABLE Orders (
    OrderID INT AUTO_INCREMENT PRIMARY KEY,
    CustomerID INT,
    OrderDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    TotalAmount DECIMAL(10, 2) DEFAULT 0.00,
    Status ENUM('Pending', 'Shipped', 'Delivered') DEFAULT 'Pending',
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID)
);

-- Order Details Table (Linking Orders and Products)
CREATE TABLE OrderDetails (
    OrderDetailID INT AUTO_INCREMENT PRIMARY KEY,
    OrderID INT,
    ProductID INT,
    Quantity INT NOT NULL,
    Subtotal DECIMAL(10, 2),
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID)
);

-- 2. SAMPLE DATA INSERTION (For Testing)
INSERT INTO Customer (Name, Email, Phone, Address) VALUES 
('Rahul Verma', 'rahul@example.com', '9876543210', 'Indiranagar, Bangalore'),
('Priya Sharma', 'priya@example.com', '9123456789', 'Hitech City, Hyderabad');

INSERT INTO Product (Name, Description, Price) VALUES 
('Medical Drone Battery', 'Li-Po 5000mAh', 1200.00),
('First Aid Kit', 'Standard Emergency Kit', 500.00);

INSERT INTO Orders (CustomerID, TotalAmount, Status) VALUES 
(1, 2900.00, 'Delivered'),
(2, 500.00, 'Pending');

INSERT INTO OrderDetails (OrderID, ProductID, Quantity, Subtotal) VALUES 
(1, 1, 2, 2400.00),
(1, 2, 1, 500.00),
(2, 2, 1, 500.00);

-- 3. ASSIGNMENT QUERIES

-- A. Retrieve all orders with customer details for a specific product (e.g., ProductID = 1)
SELECT o.OrderID, o.OrderDate, o.Status, c.Name, c.Email 
FROM Orders o
JOIN OrderDetails od ON o.OrderID = od.OrderID
JOIN Customer c ON o.CustomerID = c.CustomerID
WHERE od.ProductID = 1;

-- B. Calculate total sales for each customer
SELECT c.Name, SUM(o.TotalAmount) as TotalSpent
FROM Customer c
JOIN Orders o ON c.CustomerID = o.CustomerID
GROUP BY c.CustomerID, c.Name;

-- C. Find the customer who has placed the most orders
SELECT c.Name, COUNT(o.OrderID) as OrderCount
FROM Customer c
JOIN Orders o ON c.CustomerID = o.CustomerID
GROUP BY c.CustomerID, c.Name
ORDER BY OrderCount DESC
LIMIT 1;

-- D. Retrieve orders with a total amount higher than the average order amount
SELECT * FROM Orders 
WHERE TotalAmount > (SELECT AVG(TotalAmount) FROM Orders);

-- E. Get the most recent order for each customer
SELECT o.* FROM Orders o
INNER JOIN (
    SELECT CustomerID, MAX(OrderDate) as LatestDate
    FROM Orders
    GROUP BY CustomerID
) latest ON o.CustomerID = latest.CustomerID AND o.OrderDate = latest.LatestDate;