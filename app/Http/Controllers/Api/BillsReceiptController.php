<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BillsReceipt;
use App\Models\TenantBill;
use Illuminate\Http\Request;
use App\Models\Units;
use Carbon\Carbon;

class BillsReceiptController extends Controller
{
    /**
     * Display all bills receipts
     */
    public function index()
    {
        $receipts = BillsReceipt::latest()->get();

        return response()->json([
            'message' => 'Bills receipts retrieved successfully',
            'data' => $receipts,
        ], 200);
    }

    /**
     * Store a new bills receipt
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'posted_by'  => 'required|string',
            'total_bill' => 'required|numeric|min:0',
            'rate'       => 'required|numeric|min:0',
            'due_date'   => 'required|date',
            'month'      => 'required|string|max:20|unique:bills_receipts,month',
            'image'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:25600',
        ]);

        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store(
                'bills-receipts',
                'public'
            );
        }

        $receipt = BillsReceipt::create([
            'posted_by'  => $validated['posted_by'],
            'total_bill' => $validated['total_bill'],
            'rate'       => $validated['rate'],
            'due_date'   => $validated['due_date'],
            'month'      => $validated['month'],
            'year'       => substr($validated['month'], 0, 4),
            'image'      => $imagePath,
        ]);

        return response()->json([
            'message' => 'Bills receipt created successfully',
            'data' => $receipt,
        ], 201);
    }

    /**
     * Show a single bills receipt
     */
    public function show($id)
    {
        $receipt = BillsReceipt::findOrFail($id);

        return response()->json([
            'message' => 'Bills receipt retrieved successfully',
            'data' => $receipt,
        ], 200);
    }

    /**
     * Delete a bills receipt
     */
    public function destroy($id)
    {
        $receipt = BillsReceipt::findOrFail($id);
        $receipt->delete();

        return response()->json([
            'message' => 'Bills receipt deleted successfully',
            'data' => $receipt,
        ], 201);
    }


    /**
     * Get bills receipt by month
     * Example: /bills-receipts/month/2026-01
     */
    public function getByMonth($month)
    {
        // Get all available tenants
        $tenants = Units::where('status', 'available')->get();

        // Monthly total bill (can be null)
        $CurentBill = BillsReceipt::where('month', $month)->first();

        // All tenant bills for the current month
        $tenantBills = TenantBill::where('month', $month)->get();

        $data = $tenants->map(function ($tenant) use ($tenantBills, $month) {

            // Bill for this tenant for the current month
            $currentTenantBill = $tenantBills
                ->where('unit_id', $tenant->id)
                ->first();

            if ($currentTenantBill) {
                // Bill exists → return it
                $bills = [$currentTenantBill];
            } else {
                $currentMonth = Carbon::parse($month); // e.g., '2026-01'
                $previousMonth = $currentMonth->subMonth()->format('Y-m');
                $lastBill = TenantBill::where('unit_id', $tenant->id)
                    ->where('month', $previousMonth)
                    ->first();

                $bills = [[
                    'id' => null,
                    'unit_id' => $tenant->id,
                    'month' => $month,
                    'previous_reading' => $lastBill?->current_reading ?? 0,
                    'current_reading' => 0,
                    'rate' => null,
                    'total_consumption' => null,
                    'total_amount' => null,
                    'computed_by' => null,
                    'status' => 'pending',
                    'date_paid' => null,
                    'method' => null,
                    'generated' => true,
                ]];
            }

            return [
                'unit_id'     => $tenant->id,
                'unit_number' => $tenant->unit_number,
                'tenant_name' => $tenant->tenant_name,
                'submeter_no' => $tenant->submeter_number,
                'status'      => $tenant->status,
                'bills'       => $bills,
            ];
        });

        return response()->json([
            'success'    => true,
            'month'      => $month,
            'count'      => $tenants->count(),
            'data'       => $data,
            'total_bill' => $CurentBill,
        ], 200);
    }
}
