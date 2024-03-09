<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\UuidImage;

class DeleteExpiredRecords extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:delete-expired-records';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete expired records from the uuid_images table';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        UuidImage::where('created_at', '<', now()->subHour())->delete();
        $this->info('Expired records deleted successfully.');
    }
}
