<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TenantBill extends Model
{
    protected $table = 'tenant_bills';

    protected $fillable = [
        'unit_id',
        'month',
        'previous_reading',
        'current_reading',
        'rate',
        'total_consumption',
        'total_amount',
        'computed_by',
        'status',
        'date_paid',
        'method',
    ];


    /**
     * Relationship: TenantBill belongs to Unit
     */
    public function unit()
    {
        return $this->belongsTo(Units::class, 'unit_id');
    }
}
