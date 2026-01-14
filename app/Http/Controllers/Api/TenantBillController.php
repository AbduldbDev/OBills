<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BillsReceipt;
use App\Models\TenantBill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TenantBillController extends Controller
{
    /**
     * Display all tenant bills
     */
    public function index()
    {
        $bills = TenantBill::latest()->get();

        return response()->json([
            'message' => 'Tenant bills retrieved successfully',
            'data' => $bills,
        ], 200);
    }

    /**
     * Store a new tenant bill
     */
    public function store(Request $request)
    {
        // Minimal validation — computation will be done here
        $validated = $request->validate([
            'unit_id' => 'required|exists:units,id',
            'month' => 'required|date',
            'previous_reading' => 'nullable|numeric|min:0',
            'current_reading'  => 'nullable|numeric|min:0',
            'rate' => 'nullable|integer|min:0',
            'computed_by' => 'nullable|string|max:255',
            'status' => 'nullable|string|max:50',
        ]);

        // Compute total_consumption and total_amount
        $validated['total_consumption'] = $validated['current_reading'] - $validated['previous_reading'];
        $validated['total_amount'] = $validated['total_consumption'] * $validated['rate'];
        $validated['status'] = 'pending';
        $validated['computed_by'] = Auth::user()->name;

        // Update existing bill for the same unit & month, or create new
        $bill = TenantBill::updateOrCreate(
            [
                'unit_id' => $validated['unit_id'],
                'month'   => $validated['month'],
            ],
            $validated
        );

        return response()->json([
            'success' => true,
            'message' => 'Tenant bill saved successfully',
            'data' => $bill,
        ], 201);
    }

    /**
     * Show a single tenant bill
     */
    public function show($id)
    {
        $bill = TenantBill::findOrFail($id);

        return response()->json([
            'message' => 'Tenant bill retrieved successfully',
            'data' => $bill,
        ], 200);
    }

    /**
     * Display all tenant bills
     */
    public function getByMonth($month)
    {
        $bills = TenantBill::with('unit')->where('month', $month)->get();

        return response()->json([
            'message' => 'Tenant bills retrieved successfully',
            'data' => $bills,
        ], 200);
    }

    /**
     * Display all tenant bills
     */
    public function getCalculationDetails($id, $month)
    {
        $details = TenantBill::with('unit')->where('unit_id', $id)->where('month', $month)->first();
        $month = BillsReceipt::where('month', $month)->first();


        return response()->json([
            'message' => 'Tenant bills retrieved successfully',
            'data' => $details,
            'TotalBill' => $month
        ], 200);
    }


    /**
     * Display all tenant bills
     */

    public function getBillHistory($id, $year)
    {
        $details = TenantBill::with('unit')
            ->where('unit_id', $id)
            ->where('month', 'LIKE', $year . '%')
            ->get();

        // $month = BillsReceipt::where('month', $month)->first();

        return response()->json([
            'message' => 'Tenant bills retrieved successfully',
            'data' => $details,

        ], 200);
    }


    /**
     * Display all tenant bills
     */
    public function getByUnit($id)
    {
        $bills = TenantBill::with('unit')->where('unit_id', $id)->get();

        return response()->json([
            'message' => 'Tenant bills retrieved successfully',
            'data' => $bills,
        ], 200);
    }


    public function getDataByDate($id)
    {
        $months = TenantBill::where('unit_id', $id)
            ->select('month')
            ->distinct()
            ->orderBy('month')
            ->get();

        return response()->json([
            'message' => 'Months with data retrieved successfully',
            'data' => $months,
        ], 200);
    }
}
