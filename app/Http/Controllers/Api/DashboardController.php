<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TenantBill;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function dashboard(Request $request)
    {
        $pending = TenantBill::where('status', 'pending')->count();
        $sent    = TenantBill::where('status', 'sent')->count();
        $skipped = TenantBill::where('status', 'skipped')->count();

        $lastCalculated = TenantBill::select('unit_id', 'month')
            ->orderBy('month', 'desc')
            ->first();

        return response()->json([
            'message' => 'Dashboard data retrieved successfully',
            'data' => [
                'pending'        => $pending,
                'sent'           => $sent,
                'skipped'        => $skipped,
                'lastCalculated' => $lastCalculated,
            ],
        ], 200);
    }
}
