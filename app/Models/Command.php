<?php

namespace App\Models;

use Database\Factories\FactionFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['display_name'])]
class Command extends Model
{
    /** @use HasFactory<FactionFactory> */
    use HasFactory;

    public $timestamps = false;


}
