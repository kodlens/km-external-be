<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\ReportController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('welcome');


/** =======================================
 * CATEGORY PAGES HERE
 * ========================================
 */
Route::get('/km/login', [App\Http\Controllers\WelcomePageController::class, 'index'])->name('welcome');



Route::middleware('auth')->group(function () {

    Route::post('/posts-comments/{id}', [App\Http\Controllers\PostCommentController::class, 'postCommentStore'])->name('posts.comments-store');
    Route::get('/get-posts-comments/{id}', [App\Http\Controllers\PostCommentController::class, 'getComments'])->name('posts.get-comments');

    Route::get('/my-account', [App\Http\Controllers\Auth\MyAccountController::class, 'index']);
    Route::patch('/my-account-update', [App\Http\Controllers\Auth\MyAccountController::class, 'update']);

    Route::get('/change-password', [App\Http\Controllers\Auth\ChangePasswordController::class, 'index']);
    Route::post('/change-password', [App\Http\Controllers\Auth\ChangePasswordController::class, 'changePassword']);

    /** ====================REPORTS======================== */

    Route::get('/reports/articles-by-quarter', [ReportController::class, 'articlesByQuarter']);
    Route::get('/reports/articles-by-status', [ReportController::class, 'articlesByStatus']);
    Route::get('/reports/publication-timeliness', [ReportController::class, 'publicationTimeliness']);

    //global service API
    //Route::get('/remove-file/{filename}', [App\Http\Controllers\FileController::class, 'removeFile']);

});


Route::prefix('admin')->middleware('auth', 'admin')->group(function () {

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/dashboard', [App\Http\Controllers\Admin\AdminDashboardController::class, 'index'])->name('admin.dashboard.index');

    // Route::get('/admin/articles', [App\Http\Controllers\Admin\AdminArticleController::class, 'index'])->name('admin.articles.index');
    // Route::get('/admin/articles/create', [App\Http\Controllers\Admin\AdminArticleController::class, 'create'])->name('admin.articles.create');
    // Route::get('/admin/get-articles', [App\Http\Controllers\Admin\AdminArticleController::class, 'create'])->name('admin.articles.create');

    Route::resource('/sections', App\Http\Controllers\Admin\AdminSectionController::class)->names('admin.sections');
    Route::get('/get-sections', [App\Http\Controllers\Admin\AdminSectionController::class, 'getData'])->name('sections.get-data');
    Route::get('/load-sections', [App\Http\Controllers\Admin\AdminSectionController::class, 'loadData'])->name('sections.load');


    Route::resource('/categories', App\Http\Controllers\Admin\AdminCategoryController::class)->names('admin.categories');
    Route::get('/get-categories', [App\Http\Controllers\Admin\AdminCategoryController::class, 'getData'])->name('admin.categories-get-data');


    Route::resource('/authors', App\Http\Controllers\Admin\AdminAuthorController::class);
    Route::get('/get-authors', [App\Http\Controllers\Admin\AdminAuthorController::class, 'getData'])->name('authors.getdata');
    Route::get('/load-authors', [App\Http\Controllers\Admin\AdminAuthorController::class, 'loadData'])->name('authors.load');

    Route::resource('/statuses', App\Http\Controllers\Admin\AdminStatusController::class);
    Route::get('/get-statuses', [App\Http\Controllers\Admin\AdminStatusController::class, 'getData']);
    Route::get('/load-statuses', [App\Http\Controllers\Admin\AdminStatusController::class, 'loadData']);

    Route::resource('/quarters', App\Http\Controllers\Admin\AdminQuarterController::class);
    Route::get('/get-quarters', [App\Http\Controllers\Admin\AdminQuarterController::class, 'getData']);
    Route::get('/load-quarters', [App\Http\Controllers\Admin\AdminQuarterController::class, 'loadData']);


   // Route::resource('/pages', App\Http\Controllers\Admin\AdminPageController::class);
    //Route::get('/get-pages', [App\Http\Controllers\Admin\AdminPageController::class, 'getData'])->name('admin.pages-get-data');


    /** ====================SECTIONS======================== */
    Route::resource('/page-sections/banners', App\Http\Controllers\Admin\PageSections\AdminBannerController::class)->names('admin.sections.banners');
    Route::get('/page-sections/get-banners', [App\Http\Controllers\Admin\PageSections\AdminBannerController::class, 'getData'])->name('admin.sections.banners-get-data');
    Route::post('/page-sections/temp-upload', [App\Http\Controllers\Admin\PageSections\AdminBannerController::class, 'tempUpload'])->name('admin.sections.banners-temp-upload');
    Route::post('/page-sections/temp-remove/{filename}', [App\Http\Controllers\Admin\PageSections\AdminBannerController::class, 'removeUpload'])->name('admin.sections.banners-temp-remove');
    Route::post('/page-sections/set-active/{id}', [App\Http\Controllers\Admin\PageSections\AdminBannerController::class, 'setActive'])->name('admin.sections.banners-set-active');

    Route::resource('/page-sections/magazines', App\Http\Controllers\Admin\PageSections\AdminMagazineController::class)->names('admin.sections.magazines');
    Route::post('/page-sections/magazine/set-featured/{id}', [App\Http\Controllers\Admin\PageSections\AdminMagazineController::class, 'setFeatured'])->name('admin.sections.magazine.set-featured');
    Route::get('/page-sections/get-magazines', [App\Http\Controllers\Admin\PageSections\AdminMagazineController::class, 'getData'])->name('admin.sections.magazine-get-data');
    Route::post('/page-sections/temp-upload-cover-magazine', [App\Http\Controllers\Admin\PageSections\AdminMagazineController::class, 'tempUploadCoverMagazine'])->name('admin.sections.magazines.temp-upload-cover-magazine');

    //delete cover means remove the image from the storage and delete the filename from DB
    Route::post('/page-sections/delete-cover-magazine/{id}/{filename}', [App\Http\Controllers\Admin\PageSections\AdminMagazineController::class, 'deleteCoverMagazine']);
    //remove cover means remove the image only, not from the DB
    Route::post('/page-sections/remove-cover-magazine/{filename}', [App\Http\Controllers\Admin\PageSections\AdminMagazineController::class, 'tempRemoveCoverMagazine'])->name('admin.sections.magazines.temp-upload-cover-magazine');

    /* ===================MAGAZINES======================== */
    Route::post('/page-sections/temp-upload-pdf-magazine', [App\Http\Controllers\Admin\PageSections\AdminMagazineController::class, 'tempUploadPDFMagazine'])->name('admin.sections.magazines.temp-upload-pdf-magazine');
    Route::post('/page-sections/delete-magazine/{id}/{filename}', [App\Http\Controllers\Admin\PageSections\AdminMagazineController::class, 'deleteMagazine']);
    Route::post('/page-sections/remove-magazine/{filename}', [App\Http\Controllers\Admin\PageSections\AdminMagazineController::class, 'removeMagazine']);



    /* ===================DOSTv======================== */
    Route::resource('/page-sections/dostvs', App\Http\Controllers\Admin\PageSections\AdminDostvController::class)->names('admin.sections.dostvs');
    //Route::get('/page-sections/get-dostvs', [App\Http\Controllers\Admin\PageSections\AdminDostvController::class, 'getData'])->name('admin.sections.dostv-get-data');
    Route::get('/page-sections/get-dostvs', [App\Http\Controllers\Admin\PageSections\AdminDostvController::class, 'getData']);
    Route::post('/page-sections/dostvs/temp-upload-banner', [App\Http\Controllers\Admin\PageSections\AdminDostvController::class, 'tempUploadBanner']);
    Route::post('/page-sections/dostvs/temp-remove-banner/{fileName}', [App\Http\Controllers\Admin\PageSections\AdminDostvController::class, 'tempremoveBanner']);
    Route::post('/page-sections/dostvs/delete-dostv-banner/{id}/{fileName}', [App\Http\Controllers\Admin\PageSections\AdminDostvController::class, 'deleteDostvBanner']);
    Route::post('/page-sections/dostv-set-active/{id}', [App\Http\Controllers\Admin\PageSections\AdminDostvController::class, 'setActive']);

    /* ===================DOSTv Banner======================== */
    //Route::resource('/page-sections/dostvs', App\Http\Controllers\Admin\PageSections\AdminDostvController::class)->names('admin.sections.dostvs');
    //Route::get('/page-sections/dostvs/get-dostvs', [App\Http\Controllers\Admin\PageSections\AdminDostvController::class, 'getData']);
    /* ===================DOSTv Banner======================== */


    /* ===================DOSTv Videos======================== */
    Route::resource('/page-sections/dostv-videos', App\Http\Controllers\Admin\PageSections\AdminDostvVideoController::class);
    Route::get('/page-sections/get-dostv-videos', [App\Http\Controllers\Admin\PageSections\AdminDostvVideoController::class, 'getData']);
    Route::get('/page-sections/get-featured-dostv-videos', [App\Http\Controllers\Admin\PageSections\AdminDostvVideoController::class, 'getFeaturedVideos']);
    Route::post('/page-sections/dostv/set-featured/{id}/{value}', [App\Http\Controllers\Admin\PageSections\AdminDostvVideoController::class, 'setFeatued']);

    /* ===================DOSTv Youtube Videos======================== */

    /* ===================DOSTv Youtube Videos======================== */
    Route::resource('/page-sections/dostvs/dostvs-featured-videos', App\Http\Controllers\Admin\PageSections\AdminDostvFeaturedVideosController::class);
    Route::get('/page-sections/dostvs/get-dostvs-featured-videos', [App\Http\Controllers\Admin\PageSections\AdminDostvFeaturedVideosController::class, 'getData']);




    Route::resource('/page-sections/videos', App\Http\Controllers\Admin\PageSections\AdminVideosController::class)->names('admin.page-sections.videos');
    Route::post('/page-sections/video/set-featured/{id}', [App\Http\Controllers\Admin\PageSections\AdminVideosController::class, 'setFeatured'])->name('admin.page-sections.videos-set-featured');
    Route::post('/page-sections/video/update-order-no/{id}', [App\Http\Controllers\Admin\PageSections\AdminVideosController::class, 'updateOrderNo']);
    Route::post('/page-sections/video/set-unfeatured/{id}', [App\Http\Controllers\Admin\PageSections\AdminVideosController::class, 'setUnfeatured']);

    Route::get('/page-sections/get-videos', [App\Http\Controllers\Admin\PageSections\AdminVideosController::class, 'getData'])->name('admin.page-sections.videos-get-data');
    Route::get('/page-sections/get-featured-videos', [App\Http\Controllers\Admin\PageSections\AdminVideosController::class, 'getFeaturedVideos'])->name('admin.sections.videos-get-featured-data');


    /** ====================================SECTIONS===================================== */


    Route::resource('/posts', App\Http\Controllers\Admin\AdminPostController::class);
    Route::get('/get-posts', [App\Http\Controllers\Admin\AdminPostController::class, 'getData'])->name('admin.posts-getdata');

    Route::post('/temp-upload', [App\Http\Controllers\Admin\AdminPostController::class, 'tempUpload'])->name('posts.temp-upload');
    Route::post('/temp-remove/{filename}', [App\Http\Controllers\Admin\AdminPostController::class, 'removeUpload'])->name('posts.temp-remove');
    Route::post('/image-remove/{id}/{filename}', [App\Http\Controllers\Admin\AdminPostController::class, 'imageRemove'])->name('posts.image-remove');

    Route::post('/posts-trash/{id}', [App\Http\Controllers\Admin\AdminPostController::class, 'trash'])->name('posts.trash');
    Route::post('/posts-publish/{id}', [App\Http\Controllers\Admin\AdminPostController::class, 'publish'])->name('posts.published');
    Route::post('/posts-archive/{id}', [App\Http\Controllers\Admin\AdminPostController::class, 'archive'])->name('posts.archived');
    Route::post('/posts-draft/{id}', [App\Http\Controllers\Admin\AdminPostController::class, 'draft'])->name('posts.draft');
    Route::post('/posts-pending/{id}', [App\Http\Controllers\Admin\AdminPostController::class, 'pending'])->name('posts.pending');
    Route::post('/posts-submit-for-publishing/{id}', [App\Http\Controllers\Admin\AdminPostController::class, 'submit'])->name('posts.submit-for-publishing');
    Route::post('/posts-featured/{id}', [App\Http\Controllers\Admin\AdminPostController::class, 'featured'])->name('posts.featured');
    Route::post('/posts-unfeatured/{id}', [App\Http\Controllers\Admin\AdminPostController::class, 'unfeatured'])->name('posts.unfeatured');
    Route::post('/post-set-publish-date/{id}', [App\Http\Controllers\Admin\AdminPostController::class, 'setPublishDate'])->name('admin.post-set-publish-date');



    Route::resource('/trashes', App\Http\Controllers\Admin\AdminTrashController::class);
    Route::get('/get-trashes', [App\Http\Controllers\Admin\AdminTrashController::class, 'getData'])->name('trashes.get-data');

    Route::resource('/post-archives', App\Http\Controllers\Admin\AdminPostArchiveController::class)->names([
        'index' => 'posts.archives'
    ]);
    Route::get('/get-post-archives', [App\Http\Controllers\Admin\AdminPostArchiveController::class, 'getData'])->name('archives-post-get-data');


    Route::resource('/post-featured', App\Http\Controllers\Admin\AdminPostFeaturedController::class);
    Route::get('/get-post-featured', [App\Http\Controllers\Admin\AdminPostFeaturedController::class, 'getData']);
    Route::post('/post-featured-update-order-no', [App\Http\Controllers\Admin\AdminPostFeaturedController::class, 'postFeaturedUpdateOrderNo']);



    Route::resource('/users', App\Http\Controllers\Admin\AdminUserController::class);
    Route::get('/get-users', [App\Http\Controllers\Admin\AdminUserController::class, 'getData'])->name('users.getdata');
    Route::post('/users-change-password/{id}', [App\Http\Controllers\Admin\AdminUserController::class, 'changePassword'])->name('users.change-password');
    Route::post('/change-password/{id}', [App\Http\Controllers\Admin\AdminUserController::class, 'changePassword'])->name('users.change-password');


    Route::resource('/roles', App\Http\Controllers\Admin\AdminRoleController::class);
    Route::get('/get-roles', [App\Http\Controllers\Admin\AdminRoleController::class, 'getData'])->name('roles.getdata');

    Route::resource('/permissions', App\Http\Controllers\Admin\AdminPermissionController::class);
    Route::get('/get-permissions', [App\Http\Controllers\Admin\AdminPermissionController::class, 'getData'])->name('permissions.getdata');

    Route::resource('/role-has-permissions', App\Http\Controllers\Admin\AdminRoleHasPermissionController::class);
    Route::get('/get-role-has-permissions', [App\Http\Controllers\Admin\AdminRoleHasPermissionController::class, 'getData'])->name('role-has-permissions.getdata');

});



/** THIS ROUTE IS FOR PUBLISHER */
Route::prefix('publisher')->middleware('auth', 'publisher')->group(function () {

    Route::get('/dashboard', [App\Http\Controllers\Publisher\PublisherDashboardController::class, 'index'])->name('dashboard-index');

    Route::get('/posts', [App\Http\Controllers\Publisher\PublisherPostController::class, 'index'])->name('publisher.post-index');;
    Route::patch('/posts/{id}', [App\Http\Controllers\Publisher\PublisherPostController::class, 'update'])->name('publisher.post-update');;

    Route::get('/posts-form-view/{id}', [App\Http\Controllers\Publisher\PublisherPostController::class, 'formView'])->name('publisher.post-form-view');
    Route::get('/get-posts', [App\Http\Controllers\Publisher\PublisherPostController::class, 'getData'])->name('publisher.post-get-data');


    Route::post('/posts-publish/{id}', [App\Http\Controllers\Publisher\PublisherPostController::class, 'postPublish'])->name('publisher.post-publish');
    Route::post('/posts-unpublish/{id}', [App\Http\Controllers\Publisher\PublisherPostController::class, 'postUnpublish'])->name('publisher.post-unpublish');
    Route::post('/posts-return-to-author/{id}', [App\Http\Controllers\Publisher\PublisherPostController::class, 'postReturnToAuthor'])->name('publisher.post-return-to-author');

    Route::get('/post-publish', [App\Http\Controllers\Publisher\PublisherPostPublishController::class, 'index']);
    Route::get('/get-post-publish', [App\Http\Controllers\Publisher\PublisherPostPublishController::class, 'getData'])->name('author.post-publish-get-data');

    Route::get('/post-unpublish', [App\Http\Controllers\Publisher\PublisherPostUnpublishController::class, 'index']);
    Route::get('/get-post-unpublish', [App\Http\Controllers\Publisher\PublisherPostUnpublishController::class, 'getData'])->name('author.post-unpublish-get-data');

    //Route::get('/post-set-publish-date', [App\Http\Controllers\Publisher\PublisherPostController::class, 'index']);
    Route::post('/post-set-publish-date/{id}', [App\Http\Controllers\Publisher\PublisherPostController::class, 'setPublishDate'])->name('author.post-set-publish-date');
});

/** THIS ROUTE IS FOR ENCODER */
Route::prefix('encoder')->middleware('auth', 'encoder')->group(function () {

    Route::get('/dashboard', [App\Http\Controllers\Encoder\EncoderDashboardController::class, 'index'])->name('encoder.dashboard.index');

    Route::get('/posts', [App\Http\Controllers\Encoder\EncoderPostController::class, 'index'])->name('encoder.post.index');
    Route::get('/posts/create', [App\Http\Controllers\Encoder\EncoderPostController::class, 'create'])->name('encoder.post.create');
    Route::post('/posts', [App\Http\Controllers\Encoder\EncoderPostController::class, 'store'])->name('encoder.post.store');
    Route::get('/posts/{id}/edit', [App\Http\Controllers\Encoder\EncoderPostController::class, 'edit'])->name('encoder.post.edit');
    Route::patch('/posts/{id}', [App\Http\Controllers\Encoder\EncoderPostController::class, 'update'])->name('encoder.post.update');
    //Route::get('/posts/{id}', [App\Http\Controllers\Author\AuthorPostController::class, 'show'])->name('author.post-show');
    Route::delete('/posts/{id}', [App\Http\Controllers\Encoder\EncoderPostController::class, 'destroy'])->name('encoder.post.destroy');

    //Route::resource('/posts', App\Http\Controllers\Encoder\EncoderPostController::class);
    Route::get('/get-posts', [App\Http\Controllers\Encoder\EncoderPostController::class, 'getData'])->name('encoder.post.get-data');

  //   Route::post('/posts-trash/{id}', [App\Http\Controllers\Author\AuthorPostController::class, 'trash'])->name('posts.trash');
  //   Route::post('/temp-upload', [App\Http\Controllers\Author\AuthorPostController::class, 'tempUpload'])->name('posts.temp-upload');
  //   Route::post('/temp-remove/{filename}', [App\Http\Controllers\Author\AuthorPostController::class, 'removeUpload'])->name('posts.temp-remove');
  //   Route::post('/image-remove/{id}/{filename}', [App\Http\Controllers\Author\AuthorPostController::class, 'imageRemove'])->name('posts.image-remove');

  //   Route::post('/posts-published/{id}', [App\Http\Controllers\Author\AuthorPostController::class, 'postPublished'])->name('posts.published');
  //   Route::post('/posts-archived/{id}', [App\Http\Controllers\Author\AuthorPostController::class, 'postArchived'])->name('posts.archived');
  //   Route::post('/posts-draft/{id}', [App\Http\Controllers\Author\AuthorPostController::class, 'postDraft'])->name('posts.draft');
  //   Route::post('/posts-pending/{id}', [App\Http\Controllers\Author\AuthorPostController::class, 'postPending'])->name('posts.pending');

  //   Route::post('/posts-submit-for-publishing/{id}', [App\Http\Controllers\Author\AuthorPostController::class, 'postSubmitForPublishing'])->name('posts.submit-for-publishing');

  //   //Route::get('/get-posts-comments/{id}', [App\Http\Controllers\Author\AuthorPostController::class, 'getComments'])->name('posts.get-comments');

  //   Route::get('/post-publish', [App\Http\Controllers\Author\AuthorPostPublishController::class, 'index']);
  //   Route::get('/get-post-publish', [App\Http\Controllers\Author\AuthorPostPublishController::class, 'getData'])->name('author.post-trash-get-data');

  //   Route::get('/post-trashes', [App\Http\Controllers\Author\AuthorPostTrashController::class, 'index']);
  //   Route::get('/get-post-trashes', [App\Http\Controllers\Author\AuthorPostTrashController::class, 'getData'])->name('author.post-trash-get-data');

});
/** END AUTHOR */

require __DIR__.'/auth.php';



// logout auth (use for debuggin only)
Route::get('/applogout', function(Request $req){

    Auth::guard('web')->logout();
    $req->session()->invalidate();

    $req->session()->regenerateToken();

    return redirect('/');
});

use Illuminate\Support\Facades\Hash;
if(env('APP_DEBUG')){
    // logout auth (use for debuggin only)
    Route::get('/gen/pass/{pass}', function($pass){
        return Hash::make($pass);
    });

}
