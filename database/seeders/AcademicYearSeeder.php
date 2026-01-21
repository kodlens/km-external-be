<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AcademicYearSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $data = [
            [
                'academic_year_code' => '231',
                'academic_year_description' => '1ST SEM AY 2023-2024',
                'active' => 1,
            ],
            [
                'academic_year_code' => '232',
                'academic_year_description' => '2ND SEM AY 2023-2024',
                'active' => 1,
            ],
            [
                'academic_year_code' => '233',
                'academic_year_description' => 'SUMMER AY 2023-2024',
                'active' => 1,
            ],
            [
                'academic_year_code' => '241',
                'academic_year_description' => '1ST SEM AY 2024-2025',
                'active' => 1,
            ],
            [
                'academic_year_code' => '242',
                'academic_year_description' => '2ND SEM AY 2024-2025',
                'active' => 1,
            ],
            [
                'academic_year_code' => '243',
                'academic_year_description' => 'SUMMER AY 2024-2025',
                'active' => 1,
            ],
            
        ];

        \App\Models\AcademicYear::insertOrIgnore($data);
    }
}
