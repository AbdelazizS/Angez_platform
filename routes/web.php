<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\FreelancerProfileController;
use App\Http\Controllers\FreelancerOrderController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AdminPaymentController;
use App\Http\Controllers\FreelancerPublicProfileController;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    return Inertia::render('Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/contact', [App\Http\Controllers\ContactController::class, 'index'])->name('contact');
Route::post('/contact', [App\Http\Controllers\ContactController::class, 'submit'])->name('contact.submit');


Route::get('/faq', function () {
    return Inertia::render('Faq');
})->name('faq');


Route::get('/privacy', function () {
    return Inertia::render('Privacy');
})->name('privacy');


Route::get('/terms', function () {
    return Inertia::render('Terms');
})->name('terms');
Route::get('/rights', function () {
    return Inertia::render('Rights');
})->name('rights');

Route::get('/dashboard', function () {
    $user = Auth::user();
    if (!$user) {
        return redirect('/login');
    }
    $role = $user->primary_role; // This uses the accessor

    // dd($role);
    if ($role === 'admin') {
        return redirect()->route('admin.dashboard');
    } elseif ($role === 'client') {
        return redirect()->route('client.dashboard');
    } elseif ($role === 'freelancer') {
        return redirect()->route('freelancers.dashboard');
    }
    return abort(403, 'Unauthorized');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/freelancers/dashboard', [App\Http\Controllers\FreelancerDashboardController::class, 'index'])
    ->middleware(['auth', 'verified', 'role:freelancer'])
    ->name('freelancers.dashboard');

Route::get('/services', [App\Http\Controllers\ServiceController::class, 'index'])->name('services.index');
Route::get('/services/search', [App\Http\Controllers\ServiceController::class, 'search'])->name('services.search');


// Order routes using the new OrderController
Route::middleware(['auth'])->group(function () {
    Route::get('/services/{id}/order', [App\Http\Controllers\OrderController::class, 'create'])->name('services.order');
    Route::post('/services/{id}/order', [App\Http\Controllers\OrderController::class, 'store'])->name('services.order.store');
    
    // Order management routes
    Route::get('/orders', [App\Http\Controllers\OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{orderId}', [App\Http\Controllers\OrderController::class, 'show'])->name('orders.show');
    Route::get('/orders/{orderId}/confirmation', [App\Http\Controllers\OrderController::class, 'confirmation'])->name('orders.confirmation');
    
    // Payment routes
    Route::post('/orders/{orderId}/upload-payment', [App\Http\Controllers\OrderController::class, 'uploadPayment'])->name('orders.upload-payment');
    Route::post('/orders/{orderId}/verify-payment', [App\Http\Controllers\OrderController::class, 'verifyPayment'])->name('orders.verify-payment');
    Route::post('/orders/{orderId}/update-status', [App\Http\Controllers\OrderController::class, 'updateStatus'])->name('orders.update-status');
    Route::post('/orders/{order}/confirm-completion', [\App\Http\Controllers\OrderController::class, 'confirmCompletion']);
    
    Route::post('/orders/{orderId}/request-revision', [App\Http\Controllers\OrderController::class, 'requestRevision'])->name('orders.request-revision');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/chat', [ChatController::class, 'index'])->name('chat.index');
    Route::get('/chat/{order}', [ChatController::class, 'show'])->name('chat.show');
    Route::post('/chat/{order}/send', [ChatController::class, 'send'])->name('chat.send');
    Route::post('/chat/{order}/mark-read', [ChatController::class, 'markRead'])->name('chat.markRead');
});

// Freelancer Wallet Routes
Route::middleware(['auth', 'role:freelancer'])->group(function () {
    Route::get('/freelancer/wallet', [App\Http\Controllers\Freelancer\WalletController::class, 'index'])->name('freelancer.wallet');
    Route::post('/freelancer/wallet/payout-request', [App\Http\Controllers\Freelancer\WalletController::class, 'requestPayout'])->name('freelancer.wallet.payout');
});

// Admin Wallet Routes
Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');

    Route::get('/wallets', [App\Http\Controllers\Admin\WalletController::class, 'index'])->name('admin.wallets');
    Route::post('/payouts/{payoutRequest}/process', [App\Http\Controllers\Admin\WalletController::class, 'processPayout'])->name('admin.payouts.process');
    Route::post('/wallets/manual-operation', [App\Http\Controllers\Admin\WalletController::class, 'manualOperation'])->name('admin.wallets.manual');
    Route::post('/wallets/{wallet}/lock', [App\Http\Controllers\Admin\WalletController::class, 'lock'])->name('admin.wallets.lock');
    Route::post('/wallets/{wallet}/unlock', [App\Http\Controllers\Admin\WalletController::class, 'unlock'])->name('admin.wallets.unlock');
    Route::post('/wallets/bulk-lock', [App\Http\Controllers\Admin\WalletController::class, 'bulkLock'])->name('admin.wallets.bulk-lock');
    Route::post('/wallets/bulk-unlock', [App\Http\Controllers\Admin\WalletController::class, 'bulkUnlock'])->name('admin.wallets.bulk-unlock');
    Route::get('/wallets/export', [App\Http\Controllers\Admin\WalletController::class, 'export'])->name('admin.wallets.export');
    Route::get('/wallets/{wallet}', [App\Http\Controllers\Admin\WalletController::class, 'show'])->name('admin.wallets.show');
    
    // Admin Services Management
    Route::resource('services', App\Http\Controllers\AdminServiceController::class)->names('admin.services');
    Route::post('/services/{service}/toggle-status', [App\Http\Controllers\AdminServiceController::class, 'toggleStatus'])->name('admin.services.toggle-status');
    Route::post('/services/{service}/toggle-featured', [App\Http\Controllers\AdminServiceController::class, 'toggleFeatured'])->name('admin.services.toggle-featured');
    Route::post('/services/{service}/toggle-popular', [App\Http\Controllers\AdminServiceController::class, 'togglePopular'])->name('admin.services.toggle-popular');
    Route::post('/services/bulk-action', [App\Http\Controllers\AdminServiceController::class, 'bulkAction'])->name('admin.services.bulk-action');
    Route::post('/payouts/{payout}/approve', [App\Http\Controllers\Admin\WalletController::class, 'approvePayout'])->name('admin.payouts.approve');
    Route::post('/payouts/{payout}/reject', [App\Http\Controllers\Admin\WalletController::class, 'rejectPayout'])->name('admin.payouts.reject');
    Route::get('/payouts/{payout}/show', [App\Http\Controllers\Admin\WalletController::class, 'showPayout'])->name('admin.payouts.show');
});

Route::get('/freelancers/{id}', [FreelancerPublicProfileController::class, 'show'])->name('freelancers.show');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Freelancer Profile Management
    Route::get('/freelancers/profile/edit', [App\Http\Controllers\FreelancerProfileController::class, 'edit'])
        ->name('freelancers.profile.edit');
    Route::post('/freelancers/profile/update', [App\Http\Controllers\FreelancerProfileController::class, 'update'])
        ->name('freelancers.profile.update');
});

// Freelancer profile completion routes
Route::middleware(['auth'])->group(function () {
    Route::get('/freelancer/profile/complete', [\App\Http\Controllers\Auth\RegisterController::class, 'showProfileCompletion'])->name('freelancer.profile.complete');
    Route::post('/freelancer/profile/complete', [\App\Http\Controllers\Auth\RegisterController::class, 'completeProfile'])->name('freelancer.profile.complete.submit');
});



Route::middleware(['auth', 'verified', 'admin.only'])->group(function () {
    Route::get('/admin/payments', [AdminPaymentController::class, 'index'])->name('admin.payments.index');
    Route::post('/admin/payments/{order}/approve', [AdminPaymentController::class, 'approve'])->name('admin.payments.approve');
    Route::post('/admin/payments/{order}/reject', [AdminPaymentController::class, 'reject'])->name('admin.payments.reject');
    Route::post('/admin/payments/bulk-approve', [AdminPaymentController::class, 'bulkApprove'])->name('admin.payments.bulk-approve');
    Route::post('/admin/payments/bulk-reject', [AdminPaymentController::class, 'bulkReject'])->name('admin.payments.bulk-reject');
    Route::get('/admin/payments/export', [AdminPaymentController::class, 'export'])->name('admin.payments.export');
    Route::get('/admin/orders', [App\Http\Controllers\AdminOrderController::class, 'index'])->name('admin.orders.index');
    // Route::get('/admin/users', [App\Http\Controllers\AdminUserController::class, 'index'])->name('admin.users.index');
    // Route::get('/admin/analytics', [App\Http\Controllers\AdminAnalyticsController::class, 'index'])->name('admin.analytics.index');
});

// Public routes outside the auth group
Route::resource('services', ServiceController::class);

// Freelancer Services Management
Route::middleware(['auth', 'role:freelancer'])->prefix('freelancer')->name('freelancer.')->group(function () {
    Route::resource('services', App\Http\Controllers\FreelancerServiceController::class);
});

Route::middleware(['auth', 'role:freelancer'])->prefix('freelancer')->group(function () {
    Route::get('orders', [FreelancerOrderController::class, 'index'])->name('freelancer.orders.index');
    Route::get('orders/{order}', [FreelancerOrderController::class, 'show'])->name('freelancer.orders.show');
    Route::post('orders/{order}/update-status', [FreelancerOrderController::class, 'updateStatus'])->name('freelancer.orders.updateStatus');
    Route::post('orders/{order}/deliver-work', [FreelancerOrderController::class, 'deliverWork'])->name('freelancer.orders.deliverWork');
});

// Client dashboard route
Route::middleware(['auth', 'role:client'])->group(function () {
    Route::get('/client/dashboard', [App\Http\Controllers\ClientDashboardController::class, 'index'])->name('client.dashboard');
    Route::get('/client/orders', [App\Http\Controllers\ClientDashboardController::class, 'orders'])->name('client.orders');
    Route::get('/client/orders/{order}', [App\Http\Controllers\ClientDashboardController::class, 'showOrder'])->name('client.orders.show');
    Route::post('/client/orders/{order}/upload-payment', [App\Http\Controllers\ClientDashboardController::class, 'uploadPaymentProof'])->name('client.orders.uploadPayment');

    // Review routes
    Route::post('/client/orders/{order}/review', [App\Http\Controllers\ClientOrderReviewController::class, 'store'])->name('client.orders.review.create');
    Route::get('/client/orders/{order}/review', [App\Http\Controllers\ClientOrderReviewController::class, 'show'])->name('client.orders.review.show');
    Route::delete('/client/orders/{order}/review', [App\Http\Controllers\ClientOrderReviewController::class, 'destroy'])->name('client.orders.review.delete');
});

Route::prefix('admin')->middleware(['auth', 'admin'])->group(function () {
    Route::resource('users', App\Http\Controllers\Admin\AdminUserController::class)->names('admin.users');
    Route::post('users/{user}/make-admin', [App\Http\Controllers\Admin\AdminUserController::class, 'makeAdmin'])->name('admin.users.makeAdmin');
    Route::post('users/{user}/remove-admin', [App\Http\Controllers\Admin\AdminUserController::class, 'removeAdmin'])->name('admin.users.removeAdmin');
    Route::post('users/{user}/activate', [App\Http\Controllers\Admin\AdminUserController::class, 'activate'])->name('admin.users.activate');
    Route::post('users/{user}/deactivate', [App\Http\Controllers\Admin\AdminUserController::class, 'deactivate'])->name('admin.users.deactivate');
    Route::post('users/bulk-action', [App\Http\Controllers\Admin\AdminUserController::class, 'bulkAction'])->name('admin.users.bulkAction');
});

require __DIR__.'/auth.php';
