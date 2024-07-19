<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DropMessagesTable extends Migration
{
    public function up()
    {
        Schema::dropIfExists('messages');
    }

    public function down()
    {
        // Recreate the messages table if you need to roll back
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('from_user_id')->constrained('users');
            $table->foreignId('to_user_id')->constrained('users');
            $table->text('content');
            $table->timestamps();
        });
    }
}