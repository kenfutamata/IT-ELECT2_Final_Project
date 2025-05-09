<?php

require 'vendor/autoload.php';
require 'pdo.php'; 
Flight::route('OPTIONS *', function() {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    Flight::response()->status(204)->send();
});

Flight::set('db', getPDO());


Flight::route('POST /login', function(){
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');

    $request_data = Flight::request()->data;

    $email = $request_data['email'] ?? null; // Use null coalesce for safety
    $password = $request_data['password'] ?? null;

    if (empty($email) || empty($password)) {
        Flight::json(['status' => 'error', 'message' => 'Email and password are required.'], 400);
        return;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        Flight::json(['status' => 'error', 'message' => 'Invalid email format.'], 400);
        return;
    }

    try {
        $db = Flight::get('db');

        $stmt = $db->prepare("SELECT * FROM users WHERE email = :email");
        $stmt->execute([':email' => $email]);
        $user = $stmt->fetch(); 

        if ($user && !empty($user['password']) && password_verify($password, $user['password'])) {
            Flight::json(['status' => 'success', 'user' => $user]);
        } else {
            $logMessage = 'Invalid login attempt for email: ' . $email;
            if ($user && empty($user['password'])) {
                $logMessage .= ' (User found, but password in DB is null or empty)';
            } elseif ($user) {
                $logMessage .= ' (User found, password verify failed)';
            } else {
                $logMessage .= ' (User not found)';
            }
            error_log($logMessage);
            Flight::json(['status' => 'error', 'message' => 'Invalid email or password.'], 401);
        }
    } catch (PDOException $e) {
        error_log('Database error during login: ' . $e->getMessage() . "\n" . $e->getTraceAsString());
        Flight::json(['status' => 'error', 'message' => 'Database operation failed.'], 500);
    }
    catch (Exception $e) {
        error_log('Unexpected EXCEPTION during login: ' . $e->getMessage() . "\n" . $e->getTraceAsString());
        Flight::json(['status' => 'error', 'message' => 'An unexpected error occurred.'], 500);
    }
});


Flight::map('notFound', function(){
    if (!headers_sent()) {
        header('Access-Control-Allow-Origin: *');
        header('Content-Type: application/json');
    }
    Flight::json(['status' => 'error', 'message' => 'Route not found.'], 404);
});

Flight::map('error', function(Throwable $ex){ 
    // Log the detailed error
    error_log("Flight caught error/exception: " . $ex->getMessage() . " in " . $ex->getFile() . " on line " . $ex->getLine());
    error_log($ex->getTraceAsString()); 
    if (!headers_sent()) {
        header('Access-Control-Allow-Origin: *');
        header('Content-Type: application/json'); 
    }


    Flight::json([
        'status' => 'error',
        'message' => 'An internal server error occurred. Please try again later.'

    ], 500);
});


Flight::start();
?>