<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\ActivityLog;
use Inertia\Inertia;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // Show all users
    public function index() {
        if (auth()->user()->role !== 'admin') abort(403);

        $users = User::select('id', 'name', 'email', 'role')->get();

        return Inertia::render('Admin/Users', ['users' => $users]);
    }

    // Show soft-deleted users
    public function trash() {
        if (auth()->user()->role !== 'admin') abort(403);

        $users = User::onlyTrashed()->select('id', 'name', 'email', 'role')->get();

        return Inertia::render('Admin/UsersTrash', ['users' => $users]);
    }

    // Delete user
    public function destroy(User $user) {
        if (auth()->user()->role !== 'admin') abort(403);

        $user->delete();

        // ✅ Activity Log
        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'User Deleted',
            'description' => 'Deleted user: ' . $user->name,
        ]);

        return redirect()->back()->with('success', 'User deleted');
    }

    // Restore user
    public function restore($id) {
        if (auth()->user()->role !== 'admin') abort(403);

        $user = User::onlyTrashed()->findOrFail($id);
        $user->restore();

        // ✅ Activity Log
        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'User Restored',
            'description' => 'Restored user: ' . $user->name,
        ]);

        return redirect()->route('users.trash')->with('success', 'User restored successfully');
    }

    // Update role
    public function update(Request $request, User $user) {
        if (auth()->user()->role !== 'admin') abort(403);

        $request->validate([
            'role' => 'required|in:admin,author,assignee'
        ]);

        $oldRole = $user->role;

        $user->update([
            'role' => $request->role
        ]);

        // ✅ Activity Log
        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'Role Updated',
            'description' => "Changed role of {$user->name} from {$oldRole} to {$request->role}",
        ]);

        return redirect()->back()->with('success', 'Role updated');
    }
}