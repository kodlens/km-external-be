<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\DB;

class ValidateSlug implements ValidationRule
{

    private $id;

    public function __construct($id) {
        $this->id = $id;
    }
    
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $post = DB::table('posts')->where('slug', $value)->first();
        if($this->id > 0){
            $post = $post->where('id', '!=', $this->id);
        }
        // valid and pass
        if ($post === null) {
            return; // Validation passes
        }

        // If the post exists, check the 'trash' column
        if ($post->trash != 1) {
            // If the slug exist but not marked as trash, validation fails
            $fail('The slug already exists and is in use.');
        }
    }
}
