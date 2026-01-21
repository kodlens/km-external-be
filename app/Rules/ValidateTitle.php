<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\DB;

class ValidateTitle implements ValidationRule
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

        $post = DB::table('posts')->where('title', $value);

        if($this->id > 0){
            $post = $post->where('id', '!=', $this->id);
        }

        $post = $post->first();

        if ($post === null) {
            return; // Validation passes
        }

        // If the post exists, check the 'trash' column
        if ($post->trash != 1) {
            // If the title is not marked as trash, validation fails
            
            $fail('The title already exists from rule.');
        }
        
        // If the post exists and trash is 1, validation passes (title is considered reusable)
    }
}
