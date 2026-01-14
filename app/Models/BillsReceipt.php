<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BillsReceipt extends Model
{
    protected $table = "bills_receipts";

    protected $fillable = [
        'posted_by',
        'total_bill',
        'rate',
        'due_date',
        'month',
        'image'
    ];
}
