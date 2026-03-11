<?php
/**
 * Authentication System
 * Handles user login, registration, and session management
 */

require_once '../config/database.php';

class Auth {
    private $conn;
    private $table_name = "users";

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    // User login
    public function login($username, $password) {
        try {
            $query = "SELECT * FROM " . $this->table_name . " WHERE username = :username OR email = :username LIMIT 1";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':username', $username);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                $user = $stmt->fetch();
                
                // Verify password
                if (password_verify($password, $user['password'])) {
                    // Check if user is active
                    if ($user['status'] === 'active') {
                        // Update last login
                        $this->updateLastLogin($user['id']);
                        
                        // Store user data in session
                        $_SESSION['user_id'] = $user['id'];
                        $_SESSION['username'] = $user['username'];
                        $_SESSION['full_name'] = $user['full_name'];
                        $_SESSION['role'] = $user['role'];
                        $_SESSION['email'] = $user['email'];
                        $_SESSION['logged_in'] = true;
                        
                        return array('success' => true, 'message' => 'Login successful', 'user' => $user);
                    } else {
                        return array('success' => false, 'message' => 'Account is not active');
                    }
                } else {
                    return array('success' => false, 'message' => 'Invalid password');
                }
            } else {
                return array('success' => false, 'message' => 'User not found');
            }
        } catch(PDOException $exception) {
            error_log("Login error: " . $exception->getMessage());
            return array('success' => false, 'message' => 'Database error occurred');
        }
    }

    // User registration
    public function register($username, $email, $password, $full_name) {
        try {
            // Check if username exists
            $query = "SELECT id FROM " . $this->table_name . " WHERE username = :username LIMIT 1";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':username', $username);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                return array('success' => false, 'message' => 'Username already exists');
            }

            // Check if email exists
            $query = "SELECT id FROM " . $this->table_name . " WHERE email = :email LIMIT 1";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':email', $email);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                return array('success' => false, 'message' => 'Email already exists');
            }

            // Hash password
            $password_hash = password_hash($password, PASSWORD_BCRYPT);

            // Insert new user
            $query = "INSERT INTO " . $this->table_name . " 
                     SET username = :username, email = :email, password = :password, 
                         full_name = :full_name, role = 'staff', status = 'pending'";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':username', $username);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':password', $password_hash);
            $stmt->bindParam(':full_name', $full_name);

            if ($stmt->execute()) {
                return array('success' => true, 'message' => 'Registration successful. Please wait for admin approval.');
            } else {
                return array('success' => false, 'message' => 'Unable to register user');
            }
        } catch(PDOException $exception) {
            error_log("Registration error: " . $exception->getMessage());
            return array('success' => false, 'message' => 'Database error occurred');
        }
    }

    // Update last login time
    private function updateLastLogin($id) {
        $query = "UPDATE " . $this->table_name . " SET last_login = NOW() WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
    }

    // Check if user is logged in
    public function isLoggedIn() {
        return isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true;
    }

    // Check user role
    public function hasRole($role) {
        return isset($_SESSION['role']) && $_SESSION['role'] === $role;
    }

    // Check if user has admin privileges
    public function isAdmin() {
        return $this->hasRole('admin');
    }

    // Logout user
    public function logout() {
        session_destroy();
        return true;
    }

    // Get current user info
    public function getCurrentUser() {
        if ($this->isLoggedIn()) {
            return array(
                'id' => $_SESSION['user_id'],
                'username' => $_SESSION['username'],
                'full_name' => $_SESSION['full_name'],
                'email' => $_SESSION['email'],
                'role' => $_SESSION['role']
            );
        }
        return null;
    }

    // Change password
    public function changePassword($user_id, $current_password, $new_password) {
        try {
            // Get current user password
            $query = "SELECT password FROM " . $this->table_name . " WHERE id = :id LIMIT 1";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $user_id);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                $user = $stmt->fetch();
                
                // Verify current password
                if (password_verify($current_password, $user['password'])) {
                    // Hash new password
                    $new_password_hash = password_hash($new_password, PASSWORD_BCRYPT);
                    
                    // Update password
                    $query = "UPDATE " . $this->table_name . " SET password = :password, updated_at = NOW() WHERE id = :id";
                    $stmt = $this->conn->prepare($query);
                    $stmt->bindParam(':password', $new_password_hash);
                    $stmt->bindParam(':id', $user_id);
                    
                    if ($stmt->execute()) {
                        return array('success' => true, 'message' => 'Password changed successfully');
                    } else {
                        return array('success' => false, 'message' => 'Unable to update password');
                    }
                } else {
                    return array('success' => false, 'message' => 'Current password is incorrect');
                }
            } else {
                return array('success' => false, 'message' => 'User not found');
            }
        } catch(PDOException $exception) {
            error_log("Change password error: " . $exception->getMessage());
            return array('success' => false, 'message' => 'Database error occurred');
        }
    }

    // Reset password (admin function)
    public function resetPassword($user_id, $new_password) {
        try {
            // Hash new password
            $new_password_hash = password_hash($new_password, PASSWORD_BCRYPT);
            
            // Update password
            $query = "UPDATE " . $this->table_name . " SET password = :password, updated_at = NOW() WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':password', $new_password_hash);
            $stmt->bindParam(':id', $user_id);
            
            if ($stmt->execute()) {
                return array('success' => true, 'message' => 'Password reset successfully');
            } else {
                return array('success' => false, 'message' => 'Unable to reset password');
            }
        } catch(PDOException $exception) {
            error_log("Reset password error: " . $exception->getMessage());
            return array('success' => false, 'message' => 'Database error occurred');
        }
    }

    // Update user profile
    public function updateProfile($user_id, $full_name, $email) {
        try {
            // Check if email is already taken by another user
            $query = "SELECT id FROM " . $this->table_name . " WHERE email = :email AND id != :id LIMIT 1";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':id', $user_id);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                return array('success' => false, 'message' => 'Email already in use');
            }

            // Update profile
            $query = "UPDATE " . $this->table_name . " SET full_name = :full_name, email = :email, updated_at = NOW() WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':full_name', $full_name);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':id', $user_id);

            if ($stmt->execute()) {
                // Update session data
                $_SESSION['full_name'] = $full_name;
                $_SESSION['email'] = $email;
                return array('success' => true, 'message' => 'Profile updated successfully');
            } else {
                return array('success' => false, 'message' => 'Unable to update profile');
            }
        } catch(PDOException $exception) {
            error_log("Update profile error: " . $exception->getMessage());
            return array('success' => false, 'message' => 'Database error occurred');
        }
    }
}

// Initialize session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
