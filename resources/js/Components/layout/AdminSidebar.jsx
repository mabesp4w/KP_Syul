import Avatar from '@/Components/ui/Avatar';
import Badge from '@/Components/ui/Badge';
import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminSidebar() {
    const { url } = usePage();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { auth } = usePage().props;

    // Get current pathname
    const getCurrentPath = () => {
        if (typeof window !== 'undefined') {
            return window.location.pathname;
        }
        return url;
    };

    // Get current route name from Ziggy
    const getCurrentRoute = () => {
        try {
            return route().current();
        } catch {
            return null;
        }
    };

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    const getRoutePath = (routeName) => {
        if (!routeName) return null;

        // Route mapping manual - SELALU gunakan ini untuk route yang sudah didefinisikan
        const routeMap = {
            'admin.dashboard': '/admin/dashboard',
            'admin.provinsi.index': '/admin/provinsi',
            'admin.kab-kota.index': '/admin/kab-kota',
            'admin.kecamatan.index': '/admin/kecamatan',
            'admin.kelurahan.index': '/admin/kelurahan',
            'admin.program-pendidikan.index': '/admin/program-pendidikan',
            'admin.peserta.index': '/admin/peserta',
            'admin.kegiatan.index': '/admin/kegiatan',
            'admin.fasilitas.index': '/admin/fasilitas',
            'admin.berita.index': '/admin/berita',
            'admin.galeri.index': '/admin/galeri',
        };

        // SELALU return dari routeMap jika ada - jangan coba Ziggy untuk route yang sudah didefinisikan
        if (routeName in routeMap) {
            const path = routeMap[routeName];
            // Debug: uncomment untuk melihat route path
            // console.log(`Route: ${routeName} -> Path: ${path}`);
            return path;
        }

        // Hanya untuk route yang TIDAK ada di routeMap, coba gunakan Ziggy
        try {
            const ziggyPath = route(routeName);
            return ziggyPath;
        } catch (e) {
            return null;
        }
    };

    const isActive = (routeName) => {
        try {
            // Get current pathname - selalu gunakan window.location.pathname
            const currentPathname = typeof window !== 'undefined' ? window.location.pathname : url;

            // Normalize current path - hapus query string dan trailing slash
            const normalizedCurrent = currentPathname.split('?')[0].replace(/\/+$/, '') || '/';

            // Hardcode mapping untuk route yang sudah pasti ada (prioritas pertama)
            const routePathMap = {
                'admin.dashboard': '/admin/dashboard',
                'admin.provinsi.index': '/admin/provinsi',
                'admin.kab-kota.index': '/admin/kab-kota',
                'admin.kecamatan.index': '/admin/kecamatan',
                'admin.kelurahan.index': '/admin/kelurahan',
                'admin.program-pendidikan.index': '/admin/program-pendidikan',
                'admin.peserta.index': '/admin/peserta',
                'admin.kegiatan.index': '/admin/kegiatan',
                'admin.fasilitas.index': '/admin/fasilitas',
                'admin.berita.index': '/admin/berita',
                'admin.galeri.index': '/admin/galeri',
            };

            // Cek hardcode mapping dulu (lebih reliable)
            if (routePathMap[routeName]) {
                const expectedPath = routePathMap[routeName].replace(/\/+$/, '');
                return normalizedCurrent === expectedPath;
            }

            // Method 1: Cek menggunakan route().current() dari Ziggy (jika tersedia)
            try {
                const currentRoute = route().current();
                if (currentRoute && currentRoute === routeName) {
                    return true;
                }
            } catch {
                // route().current() tidak tersedia atau error, lanjut ke path comparison
            }

            // Method 2: Cek menggunakan path comparison
            const routePath = getRoutePath(routeName);
            if (!routePath) {
                return false;
            }

            // Normalize route path
            const normalizedRoute = routePath.split('?')[0].replace(/\/+$/, '') || '/';

            // Exact match
            return normalizedCurrent === normalizedRoute;
        } catch (e) {
            return false;
        }
    };

    const menuItems = [
        {
            title: 'Dashboard',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                </svg>
            ),
            route: 'admin.dashboard',
        },
        {
            title: 'Data Master',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
            ),
            children: [
                { title: 'Provinsi', route: 'admin.provinsi.index' },
                { title: 'Kabupaten/Kota', route: 'admin.kab-kota.index' },
                { title: 'Kecamatan', route: 'admin.kecamatan.index' },
                { title: 'Kelurahan', route: 'admin.kelurahan.index' },
            ],
        },
        {
            title: 'Program Pendidikan',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                </svg>
            ),
            route: 'admin.program-pendidikan.index',
        },
        {
            title: 'Peserta',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                </svg>
            ),
            route: 'admin.peserta.index',
        },
        {
            title: 'Kegiatan',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
            ),
            route: 'admin.kegiatan.index',
        },
        {
            title: 'Fasilitas',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                </svg>
            ),
            route: 'admin.fasilitas.index',
        },
        {
            title: 'Berita',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                </svg>
            ),
            route: 'admin.berita.index',
        },
        {
            title: 'Galeri',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
            ),
            route: 'admin.galeri.index',
        },
    ];

    return (
        <div className={`drawer-side ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}>
            <label htmlFor="admin-sidebar-drawer" className="drawer-overlay"></label>
            <aside className={`min-h-screen bg-base-200 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} flex flex-col`}>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-base-300 p-4">
                    {!isCollapsed && (
                        <Link href={route('admin.dashboard')} className="flex items-center gap-2">
                            <div className="placeholder avatar">
                                <div className="w-10 rounded-lg bg-primary text-primary-content">
                                    <span className="text-xl font-bold">PD</span>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold">PKBM Dabohaley</h2>
                                <p className="text-xs text-base-content/70">Admin Panel</p>
                            </div>
                        </Link>
                    )}
                    {isCollapsed && (
                        <div className="placeholder avatar mx-auto">
                            <div className="w-10 rounded-lg bg-primary text-primary-content">
                                <span className="text-xl font-bold">PD</span>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="btn hidden btn-ghost btn-sm lg:flex"
                        title={isCollapsed ? 'Expand' : 'Collapse'}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isCollapsed ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'} />
                        </svg>
                    </button>
                </div>

                {/* Menu Items */}
                <ul className="menu flex-1 overflow-y-auto p-4">
                    {menuItems.map((item, index) => {
                        if (item.children) {
                            const hasActiveChild = item.children.some((child) => isActive(child.route));
                            const isParentActive = isActive(item.route);
                            return (
                                <li key={index} className="mb-1">
                                    <details open={hasActiveChild || isParentActive}>
                                        <summary
                                            className={`${hasActiveChild || isParentActive ? 'active !bg-primary/20 font-semibold !text-primary' : ''} transition-all duration-200`}
                                        >
                                            {item.icon}
                                            {!isCollapsed && <span>{item.title}</span>}
                                        </summary>
                                        <ul className="mt-1 ml-2">
                                            {item.children.map((child, childIndex) => {
                                                const childRoutePath = getRoutePath(child.route);
                                                const childIsActive = isActive(child.route);
                                                return (
                                                    <li key={childIndex}>
                                                        {childRoutePath ? (
                                                            <Link
                                                                href={childRoutePath}
                                                                as="a"
                                                                className={`${childIsActive ? 'active !bg-primary font-semibold !text-primary-content' : ''} transition-all duration-200`}
                                                            >
                                                                {!isCollapsed && child.title}
                                                            </Link>
                                                        ) : (
                                                            <span className="cursor-not-allowed opacity-50">{!isCollapsed && child.title}</span>
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </details>
                                </li>
                            );
                        }

                        const routePath = getRoutePath(item.route);
                        const itemIsActive = isActive(item.route);

                        return (
                            <li key={index} className="mb-1">
                                {routePath ? (
                                    <Link
                                        href={routePath}
                                        as="a"
                                        className={`${
                                            itemIsActive ? 'active bg-primary font-semibold text-primary-content' : 'hover:bg-base-300'
                                        } rounded-lg transition-colors`}
                                        title={isCollapsed ? item.title : ''}
                                    >
                                        {item.icon}
                                        {!isCollapsed && <span>{item.title}</span>}
                                    </Link>
                                ) : (
                                    <span className="cursor-not-allowed opacity-50" title={isCollapsed ? item.title : `${item.title} (Coming Soon)`}>
                                        {item.icon}
                                        {!isCollapsed && <span>{item.title}</span>}
                                    </span>
                                )}
                            </li>
                        );
                    })}
                </ul>

                {/* Footer - User Profile */}
                <div className="border-t border-base-300 p-4">
                    <div className="mb-3 flex items-center gap-3">
                        <Avatar src={null} alt={auth.user.name} size="sm" />
                        {!isCollapsed && (
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold">{auth.user.name}</p>
                                <Badge variant="error" className="text-xs">
                                    Admin
                                </Badge>
                            </div>
                        )}
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col gap-1">
                            <button onClick={handleLogout} className="btn justify-start text-error btn-ghost btn-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
                                </svg>
                                Logout
                            </button>
                        </div>
                    )}
                    {isCollapsed && (
                        <div className="flex flex-col gap-1">
                            <Link href={route('profile.edit')} className="btn btn-circle btn-ghost btn-sm" title="Profile">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                            </Link>
                            <button onClick={handleLogout} className="btn btn-circle text-error btn-ghost btn-sm" title="Logout">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </aside>
        </div>
    );
}
