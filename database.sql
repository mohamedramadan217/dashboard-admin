-- Dashboard Database Schema
-- Created for comprehensive business intelligence dashboard

-- Create database
CREATE DATABASE IF NOT EXISTS dashboard_db;
USE dashboard_db;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'manager', 'staff') DEFAULT 'staff',
    status ENUM('active', 'inactive', 'pending') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_role (role)
);

-- Products table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    model VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    cost DECIMAL(10,2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    reorder_level INT DEFAULT 10,
    supplier VARCHAR(100),
    image_url VARCHAR(255),
    status ENUM('active', 'discontinued', 'out_of_stock') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_model (model),
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_stock (stock_quantity)
);

-- Customers table
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    country VARCHAR(50),
    postal_code VARCHAR(20),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    total_orders INT DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0.00,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    INDEX idx_email (email),
    INDEX idx_country (country),
    INDEX idx_status (status)
);

-- Orders table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    customer_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    shipping_amount DECIMAL(10,2) DEFAULT 0.00,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    shipping_method VARCHAR(50),
    tracking_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_order_number (order_number),
    INDEX idx_customer_id (customer_id),
    INDEX idx_status (status),
    INDEX idx_order_date (order_date)
);

-- Order items table
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
);

-- Website analytics table
CREATE TABLE website_analytics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date_recorded DATE NOT NULL,
    visitors INT DEFAULT 0,
    page_views INT DEFAULT 0,
    bounce_rate DECIMAL(5,2) DEFAULT 0.00,
    avg_session_duration INT DEFAULT 0, -- in seconds
    conversion_rate DECIMAL(5,2) DEFAULT 0.00,
    new_visitors INT DEFAULT 0,
    returning_visitors INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_date (date_recorded),
    INDEX idx_date (date_recorded)
);

-- Sales analytics table
CREATE TABLE sales_analytics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date_recorded DATE NOT NULL,
    total_revenue DECIMAL(10,2) DEFAULT 0.00,
    total_orders INT DEFAULT 0,
    avg_order_value DECIMAL(10,2) DEFAULT 0.00,
    total_items_sold INT DEFAULT 0,
    net_profit DECIMAL(10,2) DEFAULT 0.00,
    gross_margin DECIMAL(5,2) DEFAULT 0.00,
    operating_expenses DECIMAL(10,2) DEFAULT 0.00,
    cost_of_goods_sold DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_date (date_recorded),
    INDEX idx_date (date_recorded)
);

-- Marketing campaigns table
CREATE TABLE marketing_campaigns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    campaign_name VARCHAR(100) NOT NULL,
    campaign_type VARCHAR(50) NOT NULL, -- organic, paid, social, email
    start_date DATE NOT NULL,
    end_date DATE,
    budget DECIMAL(10,2) DEFAULT 0.00,
    spend DECIMAL(10,2) DEFAULT 0.00,
    impressions INT DEFAULT 0,
    clicks INT DEFAULT 0,
    conversions INT DEFAULT 0,
    cost_per_click DECIMAL(10,2) DEFAULT 0.00,
    conversion_rate DECIMAL(5,2) DEFAULT 0.00,
    roi DECIMAL(10,2) DEFAULT 0.00,
    status ENUM('active', 'completed', 'paused') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_campaign_type (campaign_type),
    INDEX idx_status (status),
    INDEX idx_date_range (start_date, end_date)
);

-- Customer reviews table
CREATE TABLE customer_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    product_id INT NOT NULL,
    order_id INT,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    INDEX idx_product_id (product_id),
    INDEX idx_customer_id (customer_id),
    INDEX idx_approved (is_approved)
);

-- Geographic sales table
CREATE TABLE geographic_sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    country VARCHAR(100) NOT NULL,
    country_code VARCHAR(3) NOT NULL,
    date_recorded DATE NOT NULL,
    sales_amount DECIMAL(10,2) DEFAULT 0.00,
    order_count INT DEFAULT 0,
    avg_order_value DECIMAL(10,2) DEFAULT 0.00,
    customer_count INT DEFAULT 0,
    growth_rate DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_country_date (country, date_recorded),
    INDEX idx_country (country),
    INDEX idx_date (date_recorded)
);

-- Activity log table
CREATE TABLE activity_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    table_name VARCHAR(50),
    record_id INT,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
);

-- Insert sample data

-- Sample users
INSERT INTO users (username, email, password, full_name, role, status) VALUES
('admin', 'admin@company.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin User', 'admin', 'active'),
('manager', 'manager@company.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Manager User', 'manager', 'active'),
('staff', 'staff@company.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Staff User', 'staff', 'active');

-- Sample products
INSERT INTO products (name, model, description, category, price, cost, stock_quantity, reorder_level) VALUES
('Premium Headphones', 'PH-X2000', 'Wireless Bluetooth headphones with noise cancellation', 'Audio', 199.99, 120.00, 125, 20),
('Smart Watch Pro', 'SW-P9', 'Fitness tracker with heart rate monitor', 'Wearables', 299.99, 180.00, 89, 15),
('Wireless Mouse', 'WM-X1', 'Ergonomic wireless mouse with long battery life', 'Accessories', 49.99, 30.00, 3, 10),
('Gaming Keyboard', 'GK-Mech', 'Mechanical keyboard with RGB lighting', 'Accessories', 129.99, 78.00, 12, 15),
('Wireless Mouse X', 'WM-X1-Pro', 'Premium wireless mouse with advanced sensors', 'Accessories', 79.99, 48.00, 3, 5);

-- Sample customers
INSERT INTO customers (first_name, last_name, email, phone, city, state, country, country) VALUES
('John', 'Doe', 'john.doe@example.com', '+1-555-0123', 'New York', 'NY', 'USA', '10001'),
('Jane', 'Smith', 'jane.smith@example.com', '+1-555-0124', 'Los Angeles', 'CA', 'USA', '90210'),
('Bob', 'Johnson', 'bob.johnson@example.com', '+1-555-0125', 'Chicago', 'IL', 'USA', '60601'),
('Alice', 'Brown', 'alice.brown@example.com', '+1-555-0126', 'Houston', 'TX', 'USA', '77001'),
('Charlie', 'Wilson', 'charlie.wilson@example.com', '+1-555-0127', 'Phoenix', 'AZ', 'USA', '85001'),
('Sarah', 'Thompson', 'sarah.thompson@example.com', '+44-20-7123-4567', 'London', '', 'UK', 'SW1A 1AA'),
('Michael', 'Davis', 'michael.davis@example.com', '+1-555-0128', 'Toronto', 'ON', 'Canada', 'M5H 2N2');

-- Sample orders
INSERT INTO orders (order_number, customer_id, status, payment_status, subtotal, tax_amount, shipping_amount, total_amount, payment_method) VALUES
('ORD-001', 1, 'completed', 'paid', 199.99, 16.00, 9.99, 225.98, 'Credit Card'),
('ORD-002', 2, 'pending', 'pending', 89.99, 7.20, 5.99, 103.18, 'PayPal'),
('ORD-003', 3, 'shipped', 'paid', 245.50, 19.64, 12.99, 278.13, 'Credit Card'),
('ORD-004', 4, 'completed', 'paid', 67.25, 5.38, 5.99, 78.62, 'Cash on Delivery'),
('ORD-005', 5, 'cancelled', 'refunded', 156.75, 12.54, 9.99, 179.28, 'Credit Card'),
('ORD-006', 6, 'completed', 'paid', 99.99, 8.00, 6.99, 114.98, 'Credit Card');

-- Sample order items
INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) VALUES
(1, 1, 1, 199.99, 199.99),
(2, 4, 1, 129.99, 129.99),
(3, 2, 1, 299.99, 299.99),
(4, 5, 1, 79.99, 79.99),
(5, 3, 1, 49.99, 49.99),
(6, 1, 1, 199.99, 199.99);

-- Sample website analytics
INSERT INTO website_analytics (date_recorded, visitors, page_views, bounce_rate, avg_session_duration, conversion_rate) VALUES
('2024-01-15', 1234, 2850, 42.1, 180, 3.45),
('2024-01-14', 1156, 2650, 43.2, 175, 3.28),
('2024-01-13', 1298, 3100, 40.8, 185, 3.62),
('2024-01-12', 1054, 2450, 44.5, 170, 3.15),
('2024-01-11', 1322, 3200, 41.2, 190, 3.78);

-- Sample sales analytics
INSERT INTO sales_analytics (date_recorded, total_revenue, total_orders, avg_order_value, total_items_sold, net_profit, gross_margin) VALUES
('2024-01-15', 24563.00, 156, 157.45, 189, 28450.00, 67.8),
('2024-01-14', 22890.50, 142, 161.20, 173, 26780.50, 66.9),
('2024-01-13', 25678.25, 163, 157.53, 197, 29890.75, 68.2),
('2024-01-12', 21432.80, 138, 155.31, 167, 25150.30, 66.5),
('2024-01-11', 26791.40, 171, 156.67, 208, 31250.90, 69.1);

-- Sample marketing campaigns
INSERT INTO marketing_campaigns (campaign_name, campaign_type, start_date, end_date, budget, spend, impressions, clicks, conversions) VALUES
('Organic SEO Q1', 'organic', '2024-01-01', '2024-03-31', 5000.00, 1200.00, 150000, 3247, 403),
('Google Ads Holiday', 'paid', '2023-11-01', '2023-12-31', 15000.00, 8500.00, 200000, 1567, 136),
('Social Media Launch', 'social', '2024-01-01', '2024-01-31', 3000.00, 1800.00, 500000, 2156, 73),
('Email Newsletter', 'email', '2024-01-01', '2024-01-15', 1000.00, 600.00, 12000, 892, 54);

-- Sample customer reviews
INSERT INTO customer_reviews (customer_id, product_id, order_id, rating, review_text, is_approved) VALUES
(1, 1, 1, 5, 'Excellent sound quality and comfortable fit. Highly recommended!', TRUE),
(2, 4, 2, 4, 'Good keyboard but a bit expensive. Keys feel great though.', TRUE),
(3, 2, 3, 5, 'Perfect fitness tracker. Accurate heart rate monitoring.', TRUE),
(4, 5, 4, 3, 'Mouse works well but battery life could be better.', TRUE),
(6, 1, 6, 4, 'Great headphones for the price. Noise cancellation works well.', TRUE);

-- Sample geographic sales
INSERT INTO geographic_sales (country, country_code, date_recorded, sales_amount, order_count, avg_order_value, customer_count) VALUES
('United States', 'US', '2024-01-15', 12450.00, 78, 159.62, 65),
('United Kingdom', 'GB', '2024-01-15', 8230.00, 53, 155.28, 44),
('Canada', 'CA', '2024-01-15', 3670.00, 24, 152.92, 20),
('Germany', 'DE', '2024-01-15', 2890.00, 18, 160.56, 15),
('Australia', 'AU', '2024-01-15', 1560.00, 10, 156.00, 8);

-- Create views for dashboard analytics

-- Customer satisfaction view
CREATE VIEW customer_satisfaction AS
SELECT 
    AVG(rating) as average_rating,
    COUNT(*) as total_reviews,
    SUM CASE WHEN rating >= 4 THEN 1 ELSE 0 END * 100.0 / COUNT(*) as recommendation_rate,
    (SELECT COUNT(*) FROM customers WHERE total_orders > 0) as active_customers
FROM customer_reviews 
WHERE is_approved = TRUE;

-- Product performance view
CREATE VIEW product_performance AS
SELECT 
    p.id,
    p.name,
    p.model,
    p.stock_quantity,
    p.reorder_level,
    CASE 
        WHEN p.stock_quantity <= p.reorder_level * 0.2 THEN 'critical'
        WHEN p.stock_quantity <= p.reorder_level THEN 'low'
        ELSE 'good'
    END as stock_status,
    COALESCE(SUM(oi.quantity), 0) as total_sold,
    COALESCE(SUM(oi.total_price), 0) as total_revenue
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id
WHERE p.status = 'active' AND (o.status = 'completed' OR o.status IS NULL)
GROUP BY p.id, p.name, p.model, p.stock_quantity, p.reorder_level
ORDER BY total_sold DESC;

-- Sales summary view
CREATE VIEW sales_summary AS
SELECT 
    DATE(s.date_recorded) as date,
    s.total_revenue,
    s.total_orders,
    s.avg_order_value,
    s.net_profit,
    s.gross_margin,
    w.visitors,
    w.conversion_rate,
    (s.total_revenue / w.visitors) as revenue_per_visitor
FROM sales_analytics s
LEFT JOIN website_analytics w ON s.date_recorded = w.date_recorded
WHERE s.date_recorded >= CURDATE() - INTERVAL 30 DAY
ORDER BY s.date_recorded DESC;

-- Indexes for performance optimization
CREATE INDEX idx_orders_date_status ON orders(order_date, status);
CREATE INDEX idx_order_items_product ON order_items(product_id);
CREATE INDEX idx_products_category ON products(category, status);
CREATE INDEX idx_customers_country ON customers(country);
