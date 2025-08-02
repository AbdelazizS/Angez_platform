<?php

namespace App\Console\Commands;

use App\Models\Service;
use Illuminate\Console\Command;

class UpdateServicesActiveStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'services:update-active-status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update existing services to have is_active set to true by default';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Updating services active status...');

        // Get services that don't have is_active set (null values)
        $servicesToUpdate = Service::whereNull('is_active')->count();
        
        if ($servicesToUpdate > 0) {
            $this->info("Found {$servicesToUpdate} services without is_active status.");
            
            // Update services to be active by default
            Service::whereNull('is_active')->update(['is_active' => true]);
            
            $this->info('Successfully updated services to be active by default.');
        } else {
            $this->info('All services already have is_active status set.');
        }

        // Show statistics
        $totalServices = Service::count();
        $activeServices = Service::where('is_active', true)->count();
        $inactiveServices = Service::where('is_active', false)->count();

        $this->info("\nServices Statistics:");
        $this->info("- Total Services: {$totalServices}");
        $this->info("- Active Services: {$activeServices}");
        $this->info("- Inactive Services: {$inactiveServices}");

        return Command::SUCCESS;
    }
}
