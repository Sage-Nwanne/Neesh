<?php
/**
 * Database Setup Script
 * This script creates the laravel database if it doesn't exist
 */

$host = '127.0.0.1';
$user = 'root';
$password = 'Neeshis@dminServ3r';
$database = 'laravel';

try {
    // Connect to MySQL without specifying a database
    $conn = new mysqli($host, $user, $password);
    
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    echo "✅ Connected to MySQL successfully!\n";
    
    // Create database if it doesn't exist
    $sql = "CREATE DATABASE IF NOT EXISTS `$database` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
    
    if ($conn->query($sql) === TRUE) {
        echo "✅ Database '$database' created or already exists!\n";
    } else {
        echo "❌ Error creating database: " . $conn->error . "\n";
        exit(1);
    }
    
    // Show all databases
    $result = $conn->query("SHOW DATABASES");
    echo "\n📊 Available databases:\n";
    while ($row = $result->fetch_assoc()) {
        echo "  - " . $row['Database'] . "\n";
    }
    
    $conn->close();
    echo "\n✅ Setup complete! You can now run: php artisan migrate\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
?>

