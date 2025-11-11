<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class SetupDatabase extends Command
{
    protected $signature = 'db:setup';
    protected $description = 'Create database and run migrations';

    public function handle()
    {
        $this->info('🔄 Setting up database...\n');

        try {
            // Check if database exists
            $databaseName = config('database.connections.mysql.database');
            
            $this->info("Creating database: {$databaseName}");
            
            // Create database
            DB::statement("CREATE DATABASE IF NOT EXISTS `{$databaseName}`");
            $this->info("✅ Database created/verified\n");

            // Run migrations
            $this->info("Running migrations...");
            $this->call('migrate', ['--force' => true]);
            $this->info("✅ Migrations complete\n");

            // Run seeders
            $this->info("Seeding database...");
            $this->call('db:seed', ['--class' => 'DatabaseSeeder', '--force' => true]);
            $this->info("✅ Database seeding complete\n");

            $this->info("🎉 Database setup complete!\n");
            
            return 0;

        } catch (\Exception $e) {
            $this->error('❌ Setup failed: ' . $e->getMessage());
            $this->error("\nTroubleshooting:");
            $this->error('1. Make sure MySQL is running');
            $this->error('2. Verify MySQL root password is correct in .env');
            $this->error('3. Check database permissions');
            return 1;
        }
    }
}
