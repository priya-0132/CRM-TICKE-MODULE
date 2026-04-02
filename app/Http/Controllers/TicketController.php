<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class TicketController extends Controller
{
    // Create page
    public function create()
    {
        return Inertia::render('Tickets/Create');
    }

    // Store ticket
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'required|in:Low,Medium,High',
            'file' => 'nullable|file|max:2048',
        ]);

        if ($request->hasFile('file')) {
            $validated['file'] = $request->file('file')->store('tickets');
        }

        $validated['author_id'] = auth()->id();
        $ticket = Ticket::create($validated);

        // Email to admin
        try {
            Mail::raw("New ticket created: {$ticket->title}", function ($message) {
                $message->to('rashmikaintura204@gmail.com')
                        ->subject('New Ticket Created');
            });
        } catch (\Exception $e) {
            \Log::error('MAIL ERROR (STORE): ' . $e->getMessage());
        }

        // Activity log
        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'Ticket Created',
            'description' => "Created ticket: {$ticket->title}",
        ]);

        return redirect()->route('dashboard')
            ->with('success', 'Ticket created successfully!');
    }

    // List tickets
    public function index(Request $request)
    {
        $user = auth()->user();
        $query = Ticket::with(['author', 'assignee']);

        if ($user->role === 'author') {
            $query->where('author_id', $user->id);
        } elseif ($user->role === 'assignee') {
            $query->where('assigned_to', $user->id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        return Inertia::render('Tickets/Index', [
            'tickets' => $query->latest()->get(),
            'filters' => $request->only(['status', 'priority']),
        ]);
    }

    // Show ticket
    public function show(Ticket $ticket)
    {
        $user = auth()->user();

        if ($user->role === 'author' && $ticket->author_id !== $user->id) abort(403);
        if ($user->role === 'assignee' && $ticket->assigned_to !== $user->id) abort(403);

        $ticket->load(['author', 'assignee', 'comments.user']);

        return Inertia::render('Tickets/Show', [
            'ticket' => $ticket
        ]);
    }

    // Edit ticket
    public function edit(Ticket $ticket)
    {
        $user = auth()->user();

        if ($user->role === 'author' && $ticket->author_id !== $user->id) abort(403);

        $assignees = User::where('role', 'assignee')
            ->select('id', 'name', 'email')
            ->get();

        $ticket->load(['author', 'assignee']);

        return Inertia::render('Tickets/Edit', [
            'ticket' => $ticket,
            'assignees' => $assignees,
        ]);
    }

    // Update ticket
    public function update(Request $request, Ticket $ticket)
    {
        $user = auth()->user();

        // =========================
        // ASSIGNEE → update status
        // =========================
        if ($user->role === 'assignee') {

            if ($ticket->assigned_to !== $user->id) abort(403);

            $request->validate([
                'status' => 'required|in:Pending,InProgress,Completed'
            ]);

            $oldStatus = $ticket->status;

            $ticket->update([
                'status' => $request->status
            ]);

            ActivityLog::create([
                'user_id' => $user->id,
                'action' => 'Ticket Status Updated',
                'description' => "Updated {$ticket->title} to {$request->status}",
            ]);

            // Email to author (only if changed)
            if ($oldStatus !== $request->status && $ticket->author?->email) {
                try {
                    Mail::raw("Your ticket '{$ticket->title}' status changed to {$request->status}", function ($message) use ($ticket) {
                        $message->to($ticket->author->email)
                                ->subject('Ticket Status Updated');
                    });
                } catch (\Exception $e) {
                    \Log::error('MAIL ERROR (STATUS): ' . $e->getMessage());
                }
            }

            return back()->with('success', 'Status updated');
        }

        // =========================
        // ADMIN / AUTHOR
        // =========================
        if ($user->role === 'author' && $ticket->author_id !== $user->id) abort(403);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'required|in:Low,Medium,High',
            'status' => 'required|in:Pending,InProgress,Completed',
            'assigned_to' => 'nullable|exists:users,id',
            'file' => 'nullable|file|max:2048',
        ]);

        if ($request->hasFile('file')) {
            $validated['file'] = $request->file('file')->store('tickets');
        }

        $oldAssigned = $ticket->assigned_to;
        $oldStatus = $ticket->status;

        $ticket->update($validated);

        // Email → new assignee
        if (!empty($validated['assigned_to']) && $validated['assigned_to'] != $oldAssigned) {

            $assignee = User::find($validated['assigned_to']);

            if ($assignee?->email) {
                try {
                    Mail::raw("You have been assigned ticket: {$ticket->title}", function ($message) use ($assignee) {
                        $message->to($assignee->email)
                                ->subject('Ticket Assigned');
                    });
                } catch (\Exception $e) {
                    \Log::error('MAIL ERROR (ASSIGN): ' . $e->getMessage());
                }
            }
        }

        // Email → author (status change)
        if ($oldStatus !== $ticket->status && $ticket->author?->email) {
            try {
                Mail::raw("Your ticket '{$ticket->title}' updated to {$ticket->status}", function ($message) use ($ticket) {
                    $message->to($ticket->author->email)
                            ->subject('Ticket Status Updated');
                });
            } catch (\Exception $e) {
                \Log::error('MAIL ERROR (STATUS): ' . $e->getMessage());
            }
        }

        ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'Ticket Updated',
            'description' => "Updated ticket: {$ticket->title}",
        ]);

        return redirect()->route('tickets.index')
            ->with('success', 'Ticket updated successfully!');
    }

    // Delete
    public function destroy(Ticket $ticket)
    {
        $user = auth()->user();

        if ($user->role === 'author' && $ticket->author_id !== $user->id) abort(403);

        $ticket->delete();

        ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'Ticket Deleted',
            'description' => "Deleted ticket: {$ticket->title}",
        ]);

        return redirect()->route('tickets.index')
            ->with('success', 'Ticket deleted successfully!');
    }

    // Trash
    public function trash()
    {
        return Inertia::render('Tickets/Trash', [
            'tickets' => Ticket::onlyTrashed()
                ->with(['author', 'assignee'])
                ->latest()
                ->get()
        ]);
    }

    // Restore
    public function restore($id)
    {
        $ticket = Ticket::onlyTrashed()->findOrFail($id);
        $ticket->restore();

        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'Ticket Restored',
            'description' => "Restored ticket: {$ticket->title}",
        ]);

        return back()->with('success', 'Ticket restored successfully!');
    }

    // =========================
    // ✅ FIXED Notifications
    // =========================
    public function recentNotifications()
    {
        $user = auth()->user();

        // AUTHOR
        if ($user->role === 'author') {
            $titles = Ticket::where('author_id', $user->id)->pluck('title');

            return ActivityLog::where(function ($query) use ($titles) {
                    foreach ($titles as $title) {
                        $query->orWhere('description', 'like', "%{$title}%");
                    }
                })
                ->latest()
                ->take(5)
                ->get(['id', 'description', 'created_at']);
        }

        // ASSIGNEE
        if ($user->role === 'assignee') {
            $titles = Ticket::where('assigned_to', $user->id)->pluck('title');

            return ActivityLog::where(function ($query) use ($titles) {
                    foreach ($titles as $title) {
                        $query->orWhere('description', 'like', "%{$title}%");
                    }
                })
                ->latest()
                ->take(5)
                ->get(['id', 'description', 'created_at']);
        }

        // ADMIN
        return ActivityLog::latest()
            ->take(5)
            ->get(['id', 'description', 'created_at']);
    }

    // Export CSV
    public function export()
    {
        $tickets = Ticket::with(['author', 'assignee'])->get();

        return response()->stream(function () use ($tickets) {

            $file = fopen('php://output', 'w');

            fputcsv($file, ['ID', 'Title', 'Priority', 'Status', 'Author', 'Assigned To']);

            foreach ($tickets as $ticket) {
                fputcsv($file, [
                    $ticket->id,
                    $ticket->title,
                    $ticket->priority,
                    $ticket->status,
                    $ticket->author?->name,
                    $ticket->assignee?->name,
                ]);
            }

            fclose($file);

        }, 200, [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=tickets.csv",
        ]);
    }
}