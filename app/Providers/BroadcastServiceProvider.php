<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Broadcast;
use Auth;

class BroadcastServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
        Broadcast::channel('chat', function ($user) {
            return Auth::check();
        });
    }
}
