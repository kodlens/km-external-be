<?php

namespace App\Http\Controllers\Helpers;

class RecordTrail
{
    public function __construct()
    {
    }

    public function recordTrail($recordTrail, $action, $userId, $name)
    {
        return $recordTrail . $action . "|" . $userId . "|" . $name . "|" . date('Y-m-d H:i:s') . ";";
    }
}