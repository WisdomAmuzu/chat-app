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
            'from_user_id' => Auth::id(),
            // 'to_user_id' => $request->to_user_id, User message is to be sent to
            'to_user_id' => Auth::id(),
            'content' => $request->content
        ]);

        broadcast(new NewChatMessage($message))->toOthers();

        return back();
    }

    public function getMessages($userId)
    {
        $messages = Message::where(function($query) use ($userId) {
            $query->where('from_user_id', Auth::id())->where('to_user_id', $userId);
        })->orWhere(function($query) use ($userId) {
            $query->where('from_user_id', $userId)->where('to_user_id', Auth::id());
        })->orderBy('created_at', 'asc')->get();

        return response()->json($messages);
    }
}