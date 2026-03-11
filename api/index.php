<?php
/**
 * Main API Entry Point
 * Handles all API requests and routes them to appropriate handlers
 */

require_once '../config/database.php';
require_once 'auth.php';
require_once 'dashboard.php';

// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Initialize session
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Get request method and path
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Remove base path to get API endpoint
$basePath = '/api';
$endpoint = str_replace($basePath, '', $path);

// API Response helper
function sendResponse($success, $data = null, $message = '', $httpCode = 200) {
    http_response_code($httpCode);
    echo json_encode([
        'success' => $success,
        'data' => $data,
        'message' => $message
    ]);
    exit();
}

// Route handler
function route($method, $endpoint, $callback) {
    global $method, $endpoint;
    if ($_SERVER['REQUEST_METHOD'] === $method && $endpoint === $endpoint) {
        $callback();
        exit();
    }
}

// Authentication routes
route('POST', '/auth/login', function() {
    $auth = new Auth();
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['username']) || !isset($input['password'])) {
        sendResponse(false, null, 'Invalid input data', 400);
    }
    
    $result = $auth->login($input['username'], $input['password']);
    
    if ($result['success']) {
        sendResponse(true, $result['user'], $result['message']);
    } else {
        sendResponse(false, null, $result['message'], 401);
    }
});

route('POST', '/auth/logout', function() {
    $auth = new Auth();
    $auth->logout();
    sendResponse(true, null, 'Logout successful');
});

route('GET', '/auth/status', function() {
    $auth = new Auth();
    $isLoggedIn = $auth->isLoggedIn();
    $user = $isLoggedIn ? $auth->getCurrentUser() : null;
    
    sendResponse(true, [
        'logged_in' => $isLoggedIn,
        'user' => $user
    ]);
});

route('POST', '/auth/register', function() {
    $auth = new Auth();
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['username']) || !isset($input['email']) || !isset($input['password']) || !isset($input['full_name'])) {
        sendResponse(false, null, 'Invalid input data', 400);
    }
    
    $result = $auth->register($input['username'], $input['email'], $input['password'], $input['full_name']);
    
    if ($result['success']) {
        sendResponse(true, null, $result['message']);
    } else {
        sendResponse(false, null, $result['message'], 400);
    }
});

// Dashboard data routes
route('GET', '/dashboard/overview', function() {
    // Check authentication
    $auth = new Auth();
    if (!$auth->isLoggedIn()) {
        sendResponse(false, null, 'Authentication required', 401);
    }
    
    $dashboard = new DashboardAPI();
    $result = $dashboard->getOverviewStats();
    
    if ($result['success']) {
        sendResponse(true, $result['data']);
    } else {
        sendResponse(false, null, $result['message'], 500);
    }
});

route('GET', '/dashboard/sales-chart', function() {
    // Check authentication
    $auth = new Auth();
    if (!$auth->isLoggedIn()) {
        sendResponse(false, null, 'Authentication required', 401);
    }
    
    $dashboard = new DashboardAPI();
    $period = $_GET['period'] ?? 'week';
    $result = $dashboard->getSalesChartData($period);
    
    if ($result['success']) {
        sendResponse(true, $result['data']);
    } else {
        sendResponse(false, null, $result['message'], 500);
    }
});

route('GET', '/dashboard/performance', function() {
    // Check authentication
    $auth = new Auth();
    if (!$auth->isLoggedIn()) {
        sendResponse(false, null, 'Authentication required', 401);
    }
    
    $dashboard = new DashboardAPI();
    $result = $dashboard->getPerformanceMetrics();
    
    if ($result['success']) {
        sendResponse(true, $result['data']);
    } else {
        sendResponse(false, null, $result['message'], 500);
    }
});

route('GET', '/dashboard/demographics', function() {
    // Check authentication
    $auth = new Auth();
    if (!$auth->isLoggedIn()) {
        sendResponse(false, null, 'Authentication required', 401);
    }
    
    $dashboard = new DashboardAPI();
    $result = $dashboard->getCustomerDemographics();
    
    if ($result['success']) {
        sendResponse(true, $result['data']);
    } else {
        sendResponse(false, null, $result['message'], 500);
    }
});

route('GET', '/dashboard/products', function() {
    // Check authentication
    $auth = new Auth();
    if (!$auth->isLoggedIn()) {
        sendResponse(false, null, 'Authentication required', 401);
    }
    
    $dashboard = new DashboardAPI();
    $result = $dashboard->getTopProducts();
    
    if ($result['success']) {
        sendResponse(true, $result['data']);
    } else {
        sendResponse(false, null, $result['message'], 500);
    }
});

route('GET', '/dashboard/orders', function() {
    // Check authentication
    $auth = new Auth();
    if (!$auth->isLoggedIn()) {
        sendResponse(false, null, 'Authentication required', 401);
    }
    
    $dashboard = new DashboardAPI();
    $limit = $_GET['limit'] ?? 10;
    $result = $dashboard->getRecentOrders($limit);
    
    if ($result['success']) {
        sendResponse(true, $result['data']);
    } else {
        sendResponse(false, null, $result['message'], 500);
    }
});

route('GET', '/dashboard/satisfaction', function() {
    // Check authentication
    $auth = new Auth();
    if (!$auth->isLoggedIn()) {
        sendResponse(false, null, 'Authentication required', 401);
    }
    
    $dashboard = new DashboardAPI();
    $result = $dashboard->getCustomerSatisfaction();
    
    if ($result['success']) {
        sendResponse(true, $result['data']);
    } else {
        sendResponse(false, null, $result['message'], 500);
    }
});

route('GET', '/dashboard/financial', function() {
    // Check authentication
    $auth = new Auth();
    if (!$auth->isLoggedIn()) {
        sendResponse(false, null, 'Authentication required', 401);
    }
    
    $dashboard = new DashboardAPI();
    $result = $dashboard->getFinancialPerformance();
    
    if ($result['success']) {
        sendResponse(true, $result['data']);
    } else {
        sendResponse(false, null, $result['message'], 500);
    }
});

route('GET', '/dashboard/marketing', function() {
    // Check authentication
    $auth = new Auth();
    if (!$auth->isLoggedIn()) {
        sendResponse(false, null, 'Authentication required', 401);
    }
    
    $dashboard = new DashboardAPI();
    $result = $dashboard->getMarketingAnalytics();
    
    if ($result['success']) {
        sendResponse(true, $result['data']);
    } else {
        sendResponse(false, null, $result['message'], 500);
    }
});

route('GET', '/dashboard/geographic', function() {
    // Check authentication
    $auth = new Auth();
    if (!$auth->isLoggedIn()) {
        sendResponse(false, null, 'Authentication required', 401);
    }
    
    $dashboard = new DashboardAPI();
    $result = $dashboard->getGeographicPerformance();
    
    if ($result['success']) {
        sendResponse(true, $result['data']);
    } else {
        sendResponse(false, null, $result['message'], 500);
    }
});

route('GET', '/dashboard/inventory', function() {
    // Check authentication
    $auth = new Auth();
    if (!$auth->isLoggedIn()) {
        sendResponse(false, null, 'Authentication required', 401);
    }
    
    $dashboard = new DashboardAPI();
    $result = $dashboard->getInventoryStatus();
    
    if ($result['success']) {
        sendResponse(true, $result['data']);
    } else {
        sendResponse(false, null, $result['message'], 500);
    }
});

route('GET', '/dashboard/activity', function() {
    // Check authentication
    $auth = new Auth();
    if (!$auth->isLoggedIn()) {
        sendResponse(false, null, 'Authentication required', 401);
    }
    
    $dashboard = new DashboardAPI();
    $limit = $_GET['limit'] ?? 20;
    $result = $dashboard->getRecentActivity($limit);
    
    if ($result['success']) {
        sendResponse(true, $result['data']);
    } else {
        sendResponse(false, null, $result['message'], 500);
    }
});

route('GET', '/dashboard/actions', function() {
    // Check authentication
    $auth = new Auth();
    if (!$auth->isLoggedIn()) {
        sendResponse(false, null, 'Authentication required', 401);
    }
    
    $dashboard = new DashboardAPI();
    $result = $dashboard->getQuickActions();
    
    if ($result['success']) {
        sendResponse(true, $result['data']);
    } else {
        sendResponse(false, null, $result['message'], 500);
    }
});

// Default route for unmatched endpoints
sendResponse(false, null, 'Endpoint not found', 404);
