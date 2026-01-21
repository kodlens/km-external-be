import { Link, usePage } from '@inertiajs/react'
import React, { useState } from 'react'

export default function MenuBtn() {

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const  user:any = usePage().props;

    
    return (
        <>
            <div className="flex items-center relative right-0">
                <button
                    onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                >
                    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                        <path
                            className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                        <path
                            className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>

            {/* <!-- sidebar --> */}
            <div className={`sidebar ${showingNavigationDropdown ? 'active' : '0'}`}>
                
                { user.auth.user ? (
                        <div className="sidebar_content">
                            <Link method="post" href={route('logout')} 
                                as="button"
                                className="text-gray-400 transition-all hover:tracking-[2px]">
                                <i className="bx bx-log-in"></i>
                                Log Out
                            </Link>
                        </div>
                    ) : (
                        <div className="sidebar_content">
                            <Link href="/login">
                                <i className="bx bx-log-in"></i>
                                Log In
                            </Link>
                        </div>
                    )}


                {/* <!-- show when Auth --> */}
                {/* <div className="sidebar_content">
                    <a href="/admin/adminDashboard.html"
                        ><i className="bx bxs-dashboard"></i>Dashboard</a
                    >
                </div> */}
                <div className="line"></div>

                <div className="sidebar_links">
                    <h6 className="sidebar_title">Navigation</h6>
                    <div className="sidebar_content">
                        <a href="/index.html"
                            ><i className="bx bxs-basketball"></i>Home</a
                        >
                    </div>
                    <div className="sidebar_content">
                        <a href="/reccommedation.html"
                            ><i className="bx bxs-basketball"></i>Recommendation</a
                        >
                    </div>
                    <div className="sidebar_content">
                        <a href=""
                            ><i className="bx bxs-basketball"></i>The Torch Articles</a
                        >
                    </div>
                    <div className="sidebar_content">
                        <a href=""><i className="bx bxs-basketball"></i>Freedom Wall</a>
                    </div>

                    <div className="sidebar_links"></div>
                    
                  
                    
                    

                </div>
            </div>
            
        </>
    )
}
