<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TenantBill;
use App\Models\BillsReceipt;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceController extends Controller
{
    // Generate PDF for preview in browser
    public function getPDF($id)
    {
        [$data, $fileName] = $this->prepareBillData($id);

        $pdf = Pdf::loadView('electric-bill', $data)
            ->setPaper('A4', 'portrait');

        return $pdf->stream($fileName);
    }

    // Generate PDF for download
    public function downloadPDF($id)
    {
        [$data, $fileName] = $this->prepareBillData($id);

        $pdf = Pdf::loadView('electric-bill', $data)
            ->setPaper('A4', 'portrait');

        return $pdf->download($fileName);
    }

    // Private helper method to prepare data for PDF
    private function prepareBillData($id): array
    {
        $bill = TenantBill::with('unit')->findOrFail($id);
        $billReceipt = BillsReceipt::where('month', $bill->month)->first();

        // Current and previous month as Carbon objects
        $currentMonth = Carbon::parse($bill->month . '-01');
        $previousMonth = $currentMonth->copy()->subMonth();

        // Formatted strings for display
        $formattedMonth = $currentMonth->format('F Y');
        $previousMonthFormatted = $previousMonth->format('F Y');
        $billDate = Carbon::now()->format('F d, Y');

        // Due date safe handling
        $dueDate = optional($billReceipt)->due_date
            ? Carbon::parse($billReceipt->due_date)->format('F d, Y')
            : 'N/A';

        // Submeter number for file naming
        $SM = $bill->unit->submeter_number ?? 'Unknown';

        $fileName = 'SM-' . $SM . '_Electric_Bill_' . $formattedMonth . '.pdf';

        // Return data array for view + file name
        return [
            [
                'billReceipt' => $billReceipt,
                'bill' => $bill,
                'formattedMonth' => $formattedMonth,
                'previousMonthFormatted' => $previousMonthFormatted,
                'billDate' => $billDate,
                'dueDate' => $dueDate,
            ],
            $fileName
        ];
    }
}
