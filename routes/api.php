<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AccountController\AuthController;
use App\Http\Controllers\Api\AccountController;
use App\Http\Controllers\Api\UnitController;
use App\Http\Controllers\Api\BillsReceiptController;
use App\Http\Controllers\Api\TenantBillController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum',])->group(function () {
    Route::post('/logout', [AuthController::class, 'login']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::get('/accounts/check-username/', [AccountController::class, 'checkusername']);
    Route::apiResource('accounts', AccountController::class);
    Route::apiResource('units', UnitController::class);

    Route::get('bills-receipts/month/{month}', [BillsReceiptController::class, 'getByMonth']);
    Route::apiResource('bills-receipts', BillsReceiptController::class);


    Route::get('calculation-details/{id}/{month}', [TenantBillController::class, 'getCalculationDetails']);
    Route::get('tenant-bills/month/{month}', [TenantBillController::class, 'getByMonth']);
    Route::get('tenant-bills/apartment/{id}', [TenantBillController::class, 'getByUnit']);
    Route::get('reading-history/{id}/{year}', [TenantBillController::class, 'getBillHistory']);
    Route::get('data-check/{id}', [TenantBillController::class, 'getDataByDate']);
    Route::post('update-payment-status', [TenantBillController::class, 'updateStatus']);


    Route::apiResource('tenant-bills', TenantBillController::class);
});
