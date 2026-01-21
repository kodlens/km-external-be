<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $data = [
            [
                'title' => 'ITS FOR SINAG 2024',
                'slug' => 'its-for-sinag-2024',
                'article_content' => '<p>Our sincere gratitude to the Lux Mundis, the newly inducted students of Tangub City Global College, for their enthusiastic involvement in the two-day SINAG 2024 with the theme "STEP UP!" Your enthusiasm and dedication have really made this event come to life. We especially thank the City Mayor, Ben Canama, for his unfailing support. This event was a great success thanks to the leadership and commitment of our College President, Dr. Maricelle M. Nueva, Executive Vice President, Prof. Niel C. Enerio, Vice Presidents Sir Redford Quiros, Sir Jay Mar Requina, Ma\'am Rosmarie Duhaylungsod, and Ma\'am Ilyn Daguman.</p> 
                    <p>The Supreme Student Council would also like to extend their sincerest thanks to all the committees and facilitators who worked tirelessly behind the scenes to ensure the smooth execution of every detail. Your collective efforts have left an indelible mark on everyone present, inspiring us all to step up and shine brighter.</p>
                    <p>See you soon!</p>',
                'category_id' => 1,
                'author' => 'JEZZEL ZAPANTA',
                'author_id' => 1,
                'encoded_by' => 1,
                'modified_by' => null,
                'featured_image' => '455240938_960728346069115_2889022754362211218_n.jpg',
                'featured_image_caption' => 'SINAG 2024',
                'date_published' => '2024-08-16',
                'status' => 'PUBLIC',
                'is_featured' => 1,
                'views' => 20
            ],

            [
                'title' => 'GINOO AT BINIBINING SINAGTALA 2024',
                'slug' => 'ginoo-at-binibining-sinagtala-2024',
                'article_content' => '<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam harum vitae laborum, velit numquam impedit nobis tempore tenetur maxime provident, quos quibusdam perspiciatis! Consequatur fugit obcaecati odio natus facilis, libero sit iusto voluptatum facere optio officia ab rerum nobis tempore aliquid provident placeat quidem dolores esse. Impedit officia cum consequuntur!</p> 
                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptas error voluptatibus, rerum minus id officiis, labore beatae minima nesciunt facilis ex accusamus tempora omnis ullam tenetur, earum veniam consequatur atque vero. Nesciunt cumque distinctio nisi voluptatibus illo omnis sint quasi. Nostrum ut voluptas doloremque officiis incidunt quidem vitae voluptatibus sed ipsam tempora! Quia saepe ipsam doloribus rem provident distinctio quidem.</p>
                    <p>See you soon!</p>',
                'category_id' => 1,
                'author' => 'JEZZEL ZAPANTA',
                'author_id' => 1,
                'encoded_by' => 1,
                'modified_by' => null,
                'featured_image' => '455350566_959780886163861_5257418279773513911_n.jpg',
                'featured_image_caption' => 'TOP FINALIST SINAG 2024',
                'date_published' => '2024-08-16',
                'status' => 'PUBLIC',
                'is_featured' => 0,
                'views' => 20
            ],


            
            [
                'title' => 'TEST ARTCLE 2024',
                'slug' => 'test-article-2024',
                'article_content' => '<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam harum vitae laborum, velit numquam impedit nobis tempore tenetur maxime provident, quos quibusdam perspiciatis! Consequatur fugit obcaecati odio natus facilis, libero sit iusto voluptatum facere optio officia ab rerum nobis tempore aliquid provident placeat quidem dolores esse. Impedit officia cum consequuntur!</p> 
                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptas error voluptatibus, rerum minus id officiis, labore beatae minima nesciunt facilis ex accusamus tempora omnis ullam tenetur, earum veniam consequatur atque vero. Nesciunt cumque distinctio nisi voluptatibus illo omnis sint quasi. Nostrum ut voluptas doloremque officiis incidunt quidem vitae voluptatibus sed ipsam tempora! Quia saepe ipsam doloribus rem provident distinctio quidem.</p>
                    <p>See you soon!</p>',
                'category_id' => 1,
                'author' => 'JEZZEL ZAPANTA',
                'author_id' => 1,
                'encoded_by' => 1,
                'modified_by' => null,
                'featured_image' => '067ab9ae7933c9347cd58d9996073f03.jpg',
                'featured_image_caption' => 'TOP FINALIST SINAG 2024',
                'date_published' => '2024-08-16',
                'status' => 'PUBLIC',
                'is_featured' => 0,
                'views' => 20
            ],


            
            
        ];

        \App\Models\Article::insertOrIgnore($data);
    }
}
