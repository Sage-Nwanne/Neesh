#!/bin/bash

# This script resets the MySQL root password and creates the laravel database

echo "MySQL Root Password Reset Script"
echo "=================================="
echo ""
echo "This script will:"
echo "1. Stop MySQL"
echo "2. Start MySQL in safe mode"
echo "3. Reset the root password to 'root'"
echo "4. Create the 'laravel' database"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

echo ""
echo "Step 1: Stopping MySQL..."
sudo systemctl stop mysql

echo "Step 2: Starting MySQL in safe mode..."
sudo mysqld_safe --skip-grant-tables &
sleep 3

echo "Step 3: Resetting root password..."
mysql -u root << EOF
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED BY 'root';
EOF

echo "Step 4: Restarting MySQL normally..."
sudo systemctl restart mysql
sleep 2

echo "Step 5: Creating laravel database..."
mysql -u root -p'root' << EOF
CREATE DATABASE IF NOT EXISTS laravel;
SHOW DATABASES;
EOF

echo ""
echo "✅ Done! MySQL is now configured."
echo "You can now run: php artisan migrate"

