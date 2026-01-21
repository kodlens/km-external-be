<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $data = [
            [
                'role' => 'ADMIN',
            ],
            [
                'role' => 'EDITOR',
            ],
            [
                'role' => 'WRITER',
            ],
            [
                'role' => 'STUDENT',
            ],
            [
                'role' => 'CONTRIBUTOR',
            ],
        ];

        \App\Models\Role::insertOrIgnore($data);
    }
}
