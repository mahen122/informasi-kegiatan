<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    public function index()
    {
        $today = Activity::where('jenis', 'today')->orderBy('no')->get();
        $tomorrow = Activity::where('jenis', 'tomorrow')->orderBy('no')->get();
        
        return response()->json([
            'today' => $today,
            'tomorrow' => $tomorrow
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'no' => 'required|integer',
            'kegiatan' => 'required|string',
            'tanggal' => 'required|string',
            'jam' => 'required|string',
            'tempat' => 'required|string',
        ]);

        $activity = Activity::create($validated);
        return response()->json($activity, 201);
    }
}
