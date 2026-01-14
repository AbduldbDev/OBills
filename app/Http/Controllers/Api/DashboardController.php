<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TenantBill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Units;
use Carbon\Carbon;
use App\Models\BillsReceipt;

class DashboardController extends Controller
{
    public function dashboard(Request $request)
    {
        $pending = TenantBill::where('status', 'pending')->count();
        $sent    = TenantBill::where('status', 'sent')->count();
        $skipped = TenantBill::where('status', 'skipped')->count();
        $TotalTenatns = Units::count();
        $activeTenants = Units::where('status', 'available')->count();

        $lastCalculated = TenantBill::select('month')
            ->orderBy('month', 'desc')
            ->first();

        $units = [];

        $unpaidTotalAmount = TenantBill::where('status', '!=', 'paid')
            ->sum('total_amount');

        if ($lastCalculated) {
            $units = TenantBill::with('unit:id,submeter_number')
                ->where('month', $lastCalculated->month)
                ->get()
                ->pluck('unit.submeter_number')
                ->unique()
                ->values();
        }


        $monthlyBills = BillsReceipt::select(
            'month',
            DB::raw('SUM(total_bill) as total_bill')
        )
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => Carbon::parse($item->month)->format("M 'y"),
                    'total_bill' => (float) $item->total_bill
                ];
            });

        // Monthly rate (assumes 1 rate per month)
        $monthlyRates = BillsReceipt::select('month', 'rate')
            ->groupBy('month', 'rate')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => Carbon::parse($item->month)->format("M 'y"),
                    'rate' => (float) $item->rate
                ];
            });


        return response()->json([
            'message' => 'Dashboard data retrieved successfully',
            'data' => [
                'pending'        => $pending,
                'sent'           => $sent,
                'skipped'        => $skipped,
                'lastCalculated' => $lastCalculated->month ?? null,
                'submeters'      => $units,
                'unpaidTotalAmount'  => $unpaidTotalAmount,
                'totaltenants'   =>  $TotalTenatns,
                'activetenants' =>  $activeTenants,
                'monthlyBillsData' => $monthlyBills,
                'kwhRateData'      => $monthlyRates,

            ],
        ], 200);
    }
}
