
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Drop the old tickets table if needed, but safer is to alter column
        // SQLite doesn't support ALTER CHECK easily, so we do a workaround
        // We'll just disable the constraint by copying columns carefully

        DB::statement('
            CREATE TABLE tickets_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                description TEXT,
                priority TEXT,
                status TEXT,
                author_id INTEGER,
                assigned_to INTEGER,
                file TEXT,
                created_at DATETIME,
                updated_at DATETIME
            );
        ');

        DB::statement('
            INSERT INTO tickets_new (id, title, description, priority, status, author_id, assigned_to, file, created_at, updated_at)
            SELECT id, title, description, priority, status, author_id, assigned_to, file, created_at, updated_at FROM tickets;
        ');

        DB::statement('DROP TABLE tickets;');
        DB::statement('ALTER TABLE tickets_new RENAME TO tickets;');
    }

    public function down(): void
    {
        // optional
    }
};