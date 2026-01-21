<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $data = [
            [
                'status' => 'PENDING',
            ],
            [
                'status' => 'REJECTED',
            ],
            [
                'status' => 'REVISION',
            ],
            [
                'status' => 'EDITED',
            ],
            [
                'status' => 'PUBLIC',
            ],
        ];

        \App\Models\Status::insertOrIgnore($data);
    }
}
