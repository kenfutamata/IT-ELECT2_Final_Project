<?php

require 'vendor/autoload.php'; 
require 'pdo.php'; 

function sendUser($pdo){
    $users = [
        'name' => 'Admin',  
        'address' => 'admin', 
        'phone_number' => '12345678901', 
        'role' => 'admin', 
        'email' => 'admin@gmail.com',
        'password' => password_hash('admin123', PASSWORD_DEFAULT),
    ];

        $stmt = $pdo->prepare("INSERT INTO users (name, address, phone_number, role, email, password) VALUES (:name, :address, :phone_number, :role, :email, :password)");
        $stmt->execute([
            ':name' => $users['name'],
            ':address' => $users['address'],
            ':phone_number' => $users['phone_number'],
            ':role' => $users['role'],
            ':email' => $users['email'],
            ':password' => password_hash($users['password'], PASSWORD_DEFAULT),
        ]);
    echo "User data inserted successfully.";
}

function updateUser($pdo){
    try{
        $db = getPDO();
        $newPassword = 'admin123'; 
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        $stmt = $db->prepare("UPDATE users SET password = :password WHERE email = :email");
        $stmt->execute([
            ':password' => $hashedPassword,
            ':email' => 'admin@gmail.com'
        ]);
        echo "Password updated successfully.";
    }catch(PDOException $e){
        echo "Error: " . $e->getMessage();
    }
}
$pdo = getPDO(); 
// sendUser($pdo); 
updateUser($pdo);
?>