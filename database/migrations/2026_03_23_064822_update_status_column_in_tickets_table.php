<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // ✅ Drop temp table if exists
        DB::statement("DROP TABLE IF EXISTS tickets_temp;");

        // Step 1: Copy current table to temp
        DB::statement("CREATE TABLE tickets_temp AS SELECT * FROM tickets;");

        // Step 2: Drop original table
        DB::statement("DROP TABLE tickets;");

        // Step 3: Create table with updated CHECK constraint
        DB::statement("
            CREATE TABLE tickets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                description TEXT,
                priority TEXT CHECK(priority IN ('Low','Medium','High')),
                status TEXT CHECK(status IN ('Pending','In Progress','Completed')),
                author_id INTEGER,
                assigned_to INTEGER,
                file TEXT,
                created_at DATETIME,
                updated_at DATETIME
            );
        ");

        // Step 4: Copy data back (explicit column list to avoid mismatch)
        DB::statement("
            INSERT INTO tickets (id, title, description, priority, status, author_id, assigned_to, file, created_at, updated_at)
            SELECT id, title, description, priority, status, author_id, assigned_to, file, created_at, updated_at
            FROM tickets_temp;
        ");

        // Step 5: Drop temp table
        DB::statement("DROP TABLE tickets_temp;");
    }

    public function down(): void
    {
        // Optional: revert if needed
    }
};