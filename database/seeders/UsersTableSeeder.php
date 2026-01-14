<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UsersTableSeeder extends Seeder
{
    public function run()
    {

        DB::table('users')->insert([
            'name' => 'Mae Joy',
            'email' => 'admin',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'role' => 'super_admin',
            'remember_token' => Str::random(10),
            'created_at' => now(),
            'updated_at' => now(),
        ]);


        DB::table('users')->insert([
            'name' => 'Viewer User',
            'email' => 'viewer',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'role' => 'viewer',
            'remember_token' => Str::random(10),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
