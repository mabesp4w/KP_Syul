import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AdminSidebar from '@/Components/layout/AdminSidebar';
import AOSWrapper from '@/Components/AOSWrapper';

export default function AdminLayout({ auth, header, children, title = 'Admin Dashboard' }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { url } = usePage();

    // Close sidebar on mobile when route changes
    useEffect(() => {
        setSidebarOpen(false);
    }, [url]);

    return (
        <div className="drawer lg:drawer-open">
            <input
                id="admin-sidebar-drawer"
                type="checkbox"
                className="drawer-toggle"
                checked={sidebarOpen}
                onChange={(e) => setSidebarOpen(e.target.checked)}
            />

            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <div className="drawer-content flex flex-col">
                {/* Top Navbar */}
                <div className="navbar bg-base-100 shadow-sm lg:hidden">
                    <div className="flex-none">
                        <label
                            htmlFor="admin-sidebar-drawer"
                            className="btn btn-square btn-ghost drawer-button"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </label>
                    </div>
                    <div className="flex-1">
                        <Link href={route('admin.dashboard')} className="btn btn-ghost text-xl">
                            PKBM Dabohaley
                        </Link>
                    </div>
                </div>

                {/* Page Header */}
                {header && (
                    <header className="bg-base-100 shadow-sm border-b border-base-300">
                        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                {/* Page Content */}
                <main className="flex-1 bg-base-200">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <AOSWrapper>{children}</AOSWrapper>
                    </div>
                </main>
            </div>
        </div>
    );
}

