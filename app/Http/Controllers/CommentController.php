<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;
use App\Models\Ticket;

class CommentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'comment' => 'required|string',
            'ticket_id' => 'required|exists:tickets,id'
        ]);

        // Get ticket
        $ticket = Ticket::findOrFail($request->ticket_id);

        $user = auth()->user();

        // Permission check
        if (
            $user->role !== 'admin' &&
            $ticket->author_id !== $user->id &&
            $ticket->assigned_to !== $user->id
        ) {
            abort(403, 'Unauthorized to comment on this ticket');
        }

        // Create comment
        Comment::create([
            'comment' => $request->comment,
            'ticket_id' => $request->ticket_id,
            'user_id' => $user->id,
        ]);

        return back();
    }
}