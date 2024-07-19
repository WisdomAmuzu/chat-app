<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Message;
use Auth;
use App\Events\NewChatMessage;
class ChatController extends Controller
{
    public function index()
    {
        $messages = Message::with('user')->latest()->take(50)->get()->reverse();
        return Inertia::render('Chat', ['messages' => $messages]);
    }

    public function sendMessage(Request $request)
    {
        $message = Message::create([
            'user_id' => Auth::id(),
            'content' => $request->input('message')
        ]);

        broadcast(new NewChatMessage($message))->toOthers();

        return back();
    }
}