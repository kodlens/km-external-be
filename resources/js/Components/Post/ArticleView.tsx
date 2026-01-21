import { PageProps, Post } from '@/types'
import React from 'react'

export default function ArticleView({ post, className }: {post:Post, className:string } ) {
  return (
        <div className={`${className}`}>
            <hr />
           
            <div className='mt-6'>
                <img className="m-auto" src={`/storage/featured_images/${post.featured_image}`} width={700} alt="Image" />
            </div>
            <div className='italic text-center'>{post.image_caption}</div>

            <div className='mt-4 font-bold text-blue-900 text-lg'>{post.category.title}</div>
            <div className="font-bold text-2xl">{post.title}</div>
            <div className="font-bold mt-2">AUTHOR: 
                <span className='ml-2'>
                    {post.author_name ? post.author_name : <>{post.author.firstname} {post.author.lastname }</>}
                </span>
            </div>

            <div className="my-6 border-b pb-3">{post.excerpt}</div>
            <div className='mt-4 ck ck-content relative' dangerouslySetInnerHTML={{ __html: post.description}}></div>


            {/* <div className='border-t py-4 my-6'>
                <div className="w-[300px] text-justify">
                    <div className="font-bold">{post.author.firstname} {post.author.lastname }</div>
                    <div>{post.author.bio}</div>
                </div>
            </div> */}
        </div>
    )
}
