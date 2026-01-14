<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BillsReceipt;
use App\Models\TenantBill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

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


    public function updateStatus(Request $request)
    {

        $request->validate([
            'id'             => 'required|exists:tenant_bills,id',
            'status'         => 'required|in:pending,sent,paid,skipped',
            'method'         => 'nullable|string|max:100|required_if:status,paid',
            'payment_date'   => 'nullable|date|required_if:status,paid',
            'receipt'        => 'nullable|image|mimes:jpg,jpeg,png,webp|max:10240',
            'month'          => 'nullable|string',
        ]);

        $bill = TenantBill::findOrFail($request->id);
        $bill->status = $request->status;

        if ($request->filled('month')) {
            $bill->month = $request->month;
        }

        if ($request->status === 'paid') {
            $bill->method = $request->method;
            $bill->date_paid = $request->payment_date;
            $bill->payment_by = Auth::user()->name;

            if ($request->hasFile('receipt')) {
                if ($bill->image) {
                    Storage::disk('public')->delete($bill->image);
                }
                $path = $request->file('receipt')->store('receipts', 'public');
                $bill->image = $path;
            }
        }

        if ($request->status !== 'paid') {
            $bill->method = null;
            $bill->date_paid = null;
            $bill->image = null;
            $bill->payment_by = null;
        }

        $bill->save();

        return response()->json([
            'message' => 'Tenant bill updated successfully',
            'data'    => $bill,
        ], 200);
    }
}
