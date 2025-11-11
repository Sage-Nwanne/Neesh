<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class TestDatabaseConnection extends Command
{
    protected $signature = 'db:test-connection';
    protected $description = 'Test database connection and show connection details';

    public function handle()
    {
        $this->info('Testing database connection...\n');

        try {
            $connection = \DB::connection();
            $pdo = $connection->getPdo();
            
            $this->info('✅ Database connection successful!\n');
            
            $config = config('database.connections.mysql');
            $this->line('Connection Details:');
            $this->line('  Host: ' . $config['host']);
            $this->line('  Port: ' . $config['port']);
            $this->line('  Database: ' . $config['database']);
            $this->line('  Username: ' . $config['username']);
            
            return 0;
        } catch (\Exception $e) {
            $this->error('❌ Database connection failed!');
            $this->error('Error: ' . $e->getMessage());
            $this->warn('\nPossible solutions:');
            $this->warn('1. Verify MySQL is running');
            $this->warn('2. Check DB_PASSWORD in .env file');
            $this->warn('3. Verify DB_HOST and DB_PORT');
            $this->warn('4. Check if database exists: ' . config('database.connections.mysql.database'));
            return 1;
        }
    }
}
