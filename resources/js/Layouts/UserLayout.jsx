import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Button from '@/Components/ui/Button';
import AOSWrapper from '@/Components/AOSWrapper';

export default function UserLayout({ auth, children }) {
    const { url } = usePage();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    const isActive = (path) => {
        return url === path || url.startsWith(path + '/');
    };

    const menuItems = [
        { name: 'Beranda', route: '/', path: '/' },
        { name: 'Berita', route: '/berita', path: '/berita' },
        { name: 'Galeri', route: '/galeri', path: '/galeri' },
        { name: 'Kegiatan', route: '/kegiatan', path: '/kegiatan' },
        { name: 'Program', route: '/program-pendidikan', path: '/program-pendidikan' },
        { name: 'Formulir', route: '/formulir', path: '/formulir' },
    ];

    return (
        <div className="min-h-screen bg-base-100">
            {/* Navbar */}
            <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className={`menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow ${isMenuOpen ? 'block' : 'hidden'}`}
                        >
                            {menuItems.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.route}
                                        className={isActive(item.path) ? 'active font-semibold' : ''}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <Link href="/" className="btn btn-ghost text-xl font-bold">
                        PKBM Dabohaley
                    </Link>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        {menuItems.map((item) => (
                            <li key={item.name}>
                                <Link
                                    href={item.route}
                                    className={isActive(item.path) ? 'active font-semibold' : ''}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="navbar-end">
                    {auth?.user ? (
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                                    <span className="text-sm font-semibold">{auth.user.name.charAt(0).toUpperCase()}</span>
                                </div>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                            >
                                <li className="menu-title">
                                    <span>{auth.user.name}</span>
                                </li>
                                <li>
                                    <Link href="/">Dashboard</Link>
                                </li>
                                {auth.user.role === 'admin' && (
                                    <li>
                                        <Link href="/admin/dashboard">Admin Panel</Link>
                                    </li>
                                )}
                                <li>
                                    <a onClick={handleLogout}>Logout</a>
                                </li>
                            </ul>
                        </div>
                    ) : (
                            <Link href={route('login')}>
                            <Button variant="primary" size="sm">
                                    Masuk
                                </Button>
                            </Link>
                    )}
                </div>
            </div>

            {/* Page Content */}
            <main>
                <AOSWrapper>{children}</AOSWrapper>
            </main>

            {/* Footer */}
            <footer className="bg-base-200 mt-20">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        <div>
                            <h3 className="text-lg font-bold mb-4">PKBM Dabohaley</h3>
                            <p className="text-base-content/70">
                                Website Promosi Pendidikan PKBM Dabohaley - Sistem Informasi untuk mengelola data pendidikan dan kegiatan masyarakat.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-md font-semibold mb-4">Tautan Cepat</h4>
                            <ul className="space-y-2">
                                {menuItems.map((item) => (
                                    <li key={item.name}>
                                        <Link href={item.route} className="text-base-content/70 hover:text-primary">
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-md font-semibold mb-4">Kontak</h4>
                            <p className="text-base-content/70">
                                Email: info@pkbm-dabohaley.com
                                <br />
                                Telp: (021) 1234-5678
                            </p>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-base-300 text-center text-base-content/70">
                        <p>
                            &copy; {new Date().getFullYear()} PKBM Dabohaley. All rights reserved.
                            <br />
                            <span className="text-sm">Dikelola oleh <strong>Syull Wally</strong></span>
                        </p>
                    </div>
                    
                    {/* Author Schema */}
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                "@context": "https://schema.org",
                                "@type": "Person",
                                "name": "Syull Wally",
                                "jobTitle": "Pengelola PKBM Dabohaley",
                                "worksFor": {
                                    "@type": "EducationalOrganization",
                                    "name": "PKBM Dabohaley"
                                }
                            })
                        }}
                    />
                </div>
            </footer>
        </div>
    );
}

