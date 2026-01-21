<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $users = [
            [
                'username' => 'admin',
                'lname' => 'ZAPANTA',
                'fname' => 'JEZEL',
                'mname' => '',
                'sex' => 'MALE',
                'email' => 'admin@publication.org',
                'password' => Hash::make('1'),
                'role' => 'ADMINISTRATOR',
            ],

            [
                'username' => 'user',
                'lname' => 'KAAMINO',
                'fname' => 'MELDHE',
                'mname' => '',
                'sex' => 'FEMALE',
                'email' => 'user@publication.org',
                'password' => Hash::make('1'),
                'role' => 'STUDENT',
            ],
           
        ];

        \App\Models\User::insertOrIgnore($users);
    }
}
