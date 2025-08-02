<?php

namespace App\Console\Commands;

use App\Models\FreelancerProfile;
use Illuminate\Console\Command;

class UpdateFreelancerStats extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'freelancers:update-stats';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update freelancer statistics including ratings and reviews';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Updating freelancer statistics...');

        $freelancers = FreelancerProfile::all();
        $bar = $this->output->createProgressBar($freelancers->count());

        foreach ($freelancers as $freelancer) {
            $freelancer->updateStatistics();
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info('Freelancer statistics updated successfully!');

        return Command::SUCCESS;
    }
} 