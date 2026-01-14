<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AccountController extends Controller
{
    /**
     * Display all accounts
     */
    public function index()
    {
        $users = User::latest()->get();

        return response()->json([
            'message' => 'Accounts retrieved successfully',
            'data' => $users,
        ], 200);
    }

    /**
     * Store a new account
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|max:255|unique:users,email,',
            'password' => 'required|string|min:6|max:255',
            'role'     => 'required|string|max:255',
        ], [
            'email.unique' => 'Email already registered.',
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role'     => $validated['role'],
        ]);

        return response()->json([
            'message' => 'Account created successfully',
            'data' => $user,
        ], 201);
    }

    /**
     * Show a single account
     */
    public function show($id)
    {
        $user = User::findOrFail($id);

        return response()->json([
            'message' => 'Account retrieved successfully',
            'data' => $user,
        ], 200);
    }

    /**
     * Update an account
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|string|max:255|unique:users,email,' . $user->id,
            'role'  => 'required|string|max:255',
            'password' => 'nullable|string|min:6|max:255',
        ]);



        $data = [
            'name'  => $validated['name'],
            'email' => $validated['email'],
            'role'  => $validated['role'],
        ];

        // Only update password if provided
        if (!empty($validated['password'])) {
            $data['password'] = Hash::make($validated['password']);
        }

        $user->update($data);

        return response()->json([
            'message' => 'Account updated successfully',
            'data' => $user,
        ], 201);
    }

    /**
     * Delete an account
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json([
            'message' => 'Account deleted successfully',
            'data' => $user,
        ], 201);
    }
}
