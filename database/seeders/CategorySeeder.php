<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $data = [
            [
                'category' => 'News',
            ],
            [
                'category' => 'Sports',
            ],
            [
                'category' => 'Editorial',
            ],
            [
                'category' => 'Feature',
            ],
            [
                'category' => 'Literary',
            ],
            [
                'category' => 'Science and Tech',
            ],
        ];

        \App\Models\Category::insertOrIgnore($data);
    }
}
