<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Units;
use Illuminate\Http\Request;

class UnitController extends Controller
{
    /**
     * Display all units
     */
    public function index()
    {
        $units = Units::latest()->get();

        return response()->json([
            'message' => 'Units retrieved successfully',
            'data' => $units,
        ], 200);
    }

    /**
     * Store a new unit
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'unit_number' => 'required|string|max:50|unique:units,unit_number,',
            'tenant_name' => 'nullable|string|max:255',
            'submeter_number' => 'required|string|max:50|unique:units,submeter_number',
            'status' => 'required|string|max:50',
        ]);

        $unit = Units::create($validated);

        return response()->json([
            'message' => 'Unit created successfully',
            'data' => $unit,
        ], 201);
    }

    /**
     * Show a single unit
     */
    public function show($id)
    {
        $unit = Units::findOrFail($id);

        return response()->json([
            'message' => 'Unit retrieved successfully',
            'data' => $unit,
        ], 200);
    }

    /**
     * Update a unit
     */
    public function update(Request $request, $id)
    {
        $unit = Units::findOrFail($id);

        $validated = $request->validate([
            'unit_number' => 'required|string|max:50|unique:units,unit_number,' . $unit->id,
            'tenant_name' => 'nullable|string|max:255',
            'submeter_number' => 'required|string|max:50|unique:units,submeter_number,' . $unit->id,
            'status' => 'required|string|max:50',
        ]);

        $unit->update($validated);

        return response()->json([
            'message' => 'Unit updated successfully',
            'data' => $unit,
        ], 201);
    }

    /**
     * Delete a unit
     */
    public function destroy($id)
    {
        $unit = Units::findOrFail($id);
        $unit->delete();

        return response()->json([
            'message' => 'Unit deleted successfully',
            'data' => $unit,
        ], 201);
    }
}
