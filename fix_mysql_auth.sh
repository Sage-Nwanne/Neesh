#!/bin/bash

# This script fixes MySQL auth_socket issue and sets up the database

echo "MySQL Authentication Fix Script"
echo "================================"
echo ""
echo "This will:"
echo "1. Stop MySQL"
echo "2. Start MySQL in safe mode (skip-grant-tables)"
echo "3. Change root authentication from auth_socket to mysql_native_password"
echo "4. Set root password to: Macmoney1234_"
echo "5. Create laravel database"
echo "6. Restart MySQL normally"
echo ""

# Stop MySQL
echo "Stopping MySQL..."
sudo systemctl stop mysql
sleep 2

# Start in safe mode
echo "Starting MySQL in safe mode..."
sudo mysqld_safe --skip-grant-tables &
MYSQLD_PID=$!
sleep 3

# Connect and fix authentication
echo "Fixing authentication..."
mysql -u root << 'EOF'
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Macmoney1234_';
FLUSH PRIVILEGES;
EXIT;
EOF

# Kill the safe mode instance
echo "Stopping safe mode MySQL..."
sudo kill $MYSQLD_PID
sleep 2

# Restart normally
echo "Restarting MySQL normally..."
sudo systemctl start mysql
sleep 3

# Test connection and create database
echo "Testing connection and creating database..."
mysql -u root -p'Macmoney1234_' << 'EOF'
CREATE DATABASE IF NOT EXISTS laravel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SHOW DATABASES;
EXIT;
EOF

echo ""
echo "✅ Done! MySQL is now configured with password authentication."
echo "You can now run: php artisan migrate"

