import defaultTheme from 'tailwindcss/defaultTheme';


/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                primary: ['UnifrakturCook', 'cursive'],
                secondary: ['Poppins', 'sans-serif'],
            },
            backgroundColor: {
                primary: ['none', '#d9dcdb'],
            },
            textColor: {
                textColorDefault: ['#063223d8'],
            },
            colors: {
                primary: ['none', '#d9dcdb']
            }
        },
    },

    plugins: [
        require('@tailwindcss/typography','flowbite/plugin'),
    ],
};
