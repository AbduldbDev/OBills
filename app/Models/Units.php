<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Units extends Model
{

    protected $table = "units";

    protected $fillable = [
        'unit_number',
        'tenant_name',
        'submeter_number',
        'status',
    ];
}
