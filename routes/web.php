<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use App\Models\Ticket;
use App\Models\ActivityLog;

/*
|--------------------------------------------------------------------------
| Home Page
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    if (Auth::check()) {
        $user = auth()->user();

        return match ($user->role) {
            'admin' => redirect()->route('admin.dashboard'),
            'assignee' => redirect()->route('assignee.dashboard'),
            default => redirect()->route('dashboard'),
        };
    }

    return Inertia::render('Home');
});

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {

    Route::get('/dashboard', function () {
        $user = auth()->user();

        return Inertia::render('Dashboard', [
            'auth' => ['user' => $user],
            'stats' => [
                'total' => Ticket::where('author_id', $user->id)->count(),
                'pending' => Ticket::where('author_id', $user->id)->where('status', 'Pending')->count(),
                'completed' => Ticket::where('author_id', $user->id)->where('status', 'Completed')->count(),
                'assigned' => Ticket::where('assigned_to', $user->id)->count(),
            ],
        ]);
    })->name('dashboard');

    Route::get('/admin/dashboard', function () {
        $user = auth()->user();

        if ($user->role !== 'admin') {
            abort(403);
        }

        return Inertia::render('Admin/Dashboard', [
            'auth' => ['user' => $user],
            'stats' => [
                'total' => Ticket::count(),
                'pending' => Ticket::where('status', 'Pending')->count(),
                'completed' => Ticket::where('status', 'Completed')->count(),
                'assigned' => Ticket::whereNotNull('assigned_to')->count(),
            ],
        ]);
    })->name('admin.dashboard');

    Route::get('/assignee/dashboard', function () {
        $user = auth()->user();

        if ($user->role !== 'assignee') {
            abort(403);
        }

        return Inertia::render('Assignee/Dashboard', [
            'auth' => ['user' => $user],
            'tickets' => Ticket::where('assigned_to', $user->id)->get(),
        ]);
    })->name('assignee.dashboard');

    Route::get('/activity-logs', function () {
        $user = auth()->user();

        if ($user->role !== 'admin') {
            abort(403);
        }

        $logs = ActivityLog::with('user')->latest()->get();

        return Inertia::render('Admin/ActivityLogs', [
            'logs' => $logs
        ]);
    })->name('activity.logs');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/tickets/trash', [TicketController::class, 'trash'])->name('tickets.trash');
    Route::post('/tickets/{id}/restore', [TicketController::class, 'restore'])->name('tickets.restore');
    Route::get('/tickets/export', [TicketController::class, 'export'])->name('tickets.export');
    Route::resource('tickets', TicketController::class);

    Route::post('/comments', [\App\Http\Controllers\CommentController::class, 'store'])
        ->name('comments.store');

    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::get('/users/trash', [UserController::class, 'trash'])->name('users.trash');
    Route::post('/users/{id}/restore', [UserController::class, 'restore'])->name('users.restore');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    Route::patch('/users/{user}', [UserController::class, 'update'])->name('users.update');
});
Route::get('/notifications', [\App\Http\Controllers\TicketController::class, 'recentNotifications'])
    ->middleware('auth');

/*
|--------------------------------------------------------------------------
| TEST EMAIL ROUTE (SAFE)
|--------------------------------------------------------------------------
*/
Route::get('/test-mail', function () {
    Mail::raw('Hello Rashmi! Email is working 🚀', function ($message) {
        $message->to('test@example.com')
                ->subject('Test Email');
    });

    return 'Email sent! Check Mailtrap inbox';
});

require __DIR__ . '/auth.php';