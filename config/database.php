<?php
/**
 * Database Configuration
 * Database connection class for dashboard application
 */

class Database {
    private $host = 'localhost';
    private $db_name = 'dashboard_db';
    private $username = 'root';
    private $password = '';
    private $conn;

    // Database connection
    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4",
                $this->username,
                $this->password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::ATTR_PERSISTENT => true
                ]
            );
        } catch(PDOException $exception) {
            error_log("Connection error: " . $exception->getMessage());
            throw new Exception("Unable to connect to database.");
        }
        return $this->conn;
    }

    // Test database connection
    public function testConnection() {
        try {
            $conn = $this->getConnection();
            $stmt = $conn->query("SELECT 1 as test");
            $result = $stmt->fetch();
            return $result['test'] == 1;
        } catch(Exception $e) {
            error_log("Database test failed: " . $e->getMessage());
            return false;
        }
    }
}

// Usage example:
// $database = new Database();
// $conn = $database->getConnection();
