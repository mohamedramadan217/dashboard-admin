# Dashboard Database & API System

A comprehensive database and API backend for the modern business intelligence dashboard.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Installation](#installation)
- [Usage](#usage)
- [Authentication](#authentication)
- [Data Models](#data-models)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## 📊 Overview

This system provides a complete backend solution for the dashboard with:

- **MySQL Database**: Comprehensive schema with 11 tables covering all business aspects
- **PHP API**: RESTful API with authentication and data endpoints
- **JavaScript Integration**: Frontend API client for seamless integration
- **Security**: Password hashing, session management, and input validation

## 🚀 Features

### Database Features
- **User Management**: Complete user system with roles and authentication
- **Product Catalog**: Full inventory and product management
- **Order Processing**: Complete order lifecycle tracking
- **Customer Analytics**: Customer behavior and satisfaction tracking
- **Sales Analytics**: Revenue, profit, and performance metrics
- **Marketing Analytics**: Campaign tracking and ROI analysis
- **Geographic Analytics**: Multi-country sales performance
- **Website Analytics**: Traffic and conversion tracking
- **Inventory Management**: Real-time stock monitoring
- **Activity Logging**: Complete audit trail

### API Features
- **RESTful Design**: Clean, intuitive API endpoints
- **Authentication**: JWT-based authentication system
- **Error Handling**: Comprehensive error responses
- **CORS Support**: Cross-origin resource sharing enabled
- **Input Validation**: Server-side validation for all inputs
- **Security**: Protection against SQL injection and XSS

## 🗃️ Database Schema

### Core Tables

1. **users** - User accounts and authentication
2. **customers** - Customer information and analytics
3. **products** - Product catalog and inventory
4. **orders** - Order management and tracking
5. **order_items** - Order line items
6. **sales_analytics** - Daily sales performance
7. **website_analytics** - Website traffic and conversion
8. **marketing_campaigns** - Marketing campaign tracking
9. **customer_reviews** - Customer feedback and ratings
10. **geographic_sales** - Regional sales performance
11. **activity_log** - System activity audit trail

### Views
- **customer_satisfaction** - Customer satisfaction metrics
- **product_performance** - Product sales and stock analysis
- **sales_summary** - Combined sales and website analytics

## 🔌 API Endpoints

### Authentication Endpoints
```
POST /api/auth/login        - User login
POST /api/auth/logout       - User logout
GET  /api/auth/status       - Check authentication status
POST /api/auth/register     - User registration
```

### Dashboard Data Endpoints
```
GET  /api/dashboard/overview     - Overview statistics
GET  /api/dashboard/sales-chart  - Sales chart data
GET  /api/dashboard/performance  - Performance metrics
GET  /api/dashboard/demographics - Customer demographics
GET  /api/dashboard/products     - Top products
GET  /api/dashboard/orders       - Recent orders
GET  /api/dashboard/satisfaction - Customer satisfaction
GET  /api/dashboard/financial    - Financial performance
GET  /api/dashboard/marketing    - Marketing analytics
GET  /api/dashboard/geographic   - Geographic performance
GET  /api/dashboard/inventory    - Inventory status
GET  /api/dashboard/activity     - Recent activity
GET  /api/dashboard/actions      - Quick actions
```

## 🛠️ Installation

### Prerequisites
- PHP 7.4 or higher
- MySQL 5.7 or higher
- Apache/Nginx web server
- Composer (for dependencies)

### Setup Steps

1. **Create Database**
   ```sql
   CREATE DATABASE dashboard_db;
   USE dashboard_db;
   ```

2. **Import Schema**
   ```bash
   mysql -u username -p dashboard_db < database.sql
   ```

3. **Configure Database Connection**
   Edit `config/database.php` and update connection settings:
   ```php
   private $host = 'localhost';
   private $db_name = 'dashboard_db';
   private $username = 'your_username';
   private $password = 'your_password';
   ```

4. **Set Up Web Server**
   Configure your web server to point to the project directory.

5. **Set Permissions**
   Ensure the web server has read/write access to necessary directories.

## 🔐 Authentication

The system uses session-based authentication:

### Login Process
1. User submits credentials via POST `/api/auth/login`
2. Server validates credentials and creates session
3. Session data stored in `$_SESSION`
4. Client receives success response with user data

### Authentication Headers
All authenticated endpoints require:
```
Authorization: Bearer <token>
Content-Type: application/json
```

### Session Management
- Sessions are stored server-side
- Automatic session timeout
- Secure session regeneration
- Logout functionality

## 📊 Data Models

### User Model
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "full_name": "Admin User",
  "role": "admin",
  "status": "active",
  "created_at": "2024-01-01 10:00:00"
}
```

### Product Model
```json
{
  "id": 1,
  "name": "Premium Headphones",
  "model": "PH-X2000",
  "price": 199.99,
  "cost": 120.00,
  "stock_quantity": 125,
  "reorder_level": 20,
  "status": "active"
}
```

### Order Model
```json
{
  "id": 1,
  "order_number": "ORD-001",
  "customer_id": 1,
  "status": "completed",
  "total_amount": 225.98,
  "payment_status": "paid",
  "order_date": "2024-01-15 10:00:00"
}
```

## 💡 Usage Examples

### JavaScript API Client
```javascript
import { api } from './js/api.js';

// Login
const loginResult = await api.login('username', 'password');
if (loginResult.success) {
  console.log('Login successful:', loginResult.user);
}

// Get dashboard data
const stats = await api.getOverviewStats();
if (stats.success) {
  console.log('Today's revenue:', stats.data.today_revenue);
}

// Get sales chart data
const chartData = await api.getSalesChartData('month');
if (chartData.success) {
  console.log('Monthly sales data:', chartData.data);
}
```

### PHP API Usage
```php
require_once 'api/dashboard.php';

$dashboard = new DashboardAPI();
$result = $dashboard->getOverviewStats();

if ($result['success']) {
  $stats = $result['data'];
  echo "Today's revenue: $" . $stats['today_revenue'];
}
```

### Database Queries
```sql
-- Get top products by sales
SELECT p.name, SUM(oi.quantity) as total_sold
FROM products p
JOIN order_items oi ON p.id = oi.product_id
JOIN orders o ON oi.order_id = o.id
WHERE o.status = 'completed'
GROUP BY p.id, p.name
ORDER BY total_sold DESC
LIMIT 10;

-- Get monthly revenue trend
SELECT DATE(date_recorded) as date, total_revenue
FROM sales_analytics
WHERE date_recorded >= CURDATE() - INTERVAL 30 DAY
ORDER BY date_recorded ASC;
```

## 🔧 Configuration

### Environment Variables
Create `.env` file in the project root:
```env
DB_HOST=localhost
DB_NAME=dashboard_db
DB_USER=your_username
DB_PASS=your_password
JWT_SECRET=your_jwt_secret_key
```

### Security Settings
- Change default passwords
- Configure HTTPS in production
- Set up proper CORS policies
- Enable rate limiting
- Configure error logging

## 🧪 Testing

### Manual Testing
1. Test user registration and login
2. Verify dashboard data endpoints
3. Test authentication requirements
4. Check error handling

### Database Testing
```sql
-- Test data insertion
INSERT INTO products (name, model, price, cost) 
VALUES ('Test Product', 'TEST-001', 99.99, 60.00);

-- Test data retrieval
SELECT * FROM products WHERE model = 'TEST-001';

-- Test relationships
SELECT o.order_number, c.full_name, COUNT(oi.id) as item_count
FROM orders o
JOIN customers c ON o.customer_id = c.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, o.order_number, c.full_name;
```

## 📈 Performance Optimization

### Database Optimization
- Proper indexing on frequently queried columns
- Query optimization with EXPLAIN
- Connection pooling
- Caching strategies

### API Optimization
- Response compression
- Minimize database queries
- Use pagination for large datasets
- Implement caching where appropriate

## 🚨 Error Handling

### Common Errors
- **401 Unauthorized**: Invalid or missing authentication
- **400 Bad Request**: Invalid input data
- **500 Internal Server Error**: Database or server issues
- **404 Not Found**: Resource not found

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "data": null
}
```

## 🔄 Updates and Maintenance

### Database Updates
1. Always backup database before updates
2. Test migrations on development environment
3. Update indexes and constraints as needed
4. Monitor performance after changes

### API Updates
1. Maintain backward compatibility
2. Version API endpoints when needed
3. Update documentation for changes
4. Test all endpoints after updates

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Dashboard frontend design and implementation
- Database schema design
- API architecture and development
- Security implementation and testing

---

