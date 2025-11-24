import { Head, Link, useForm, router } from '@inertiajs/react';
import Button from '@/Components/ui/Button';
import Alert from '@/Components/ui/Alert';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Login - PKBM Dabohaley">
                <meta name="description" content="Login ke sistem PKBM Dabohaley untuk mengakses dashboard admin atau petugas." />
                <meta name="author" content="Syull Wally" />
            </Head>

            <div className="min-h-screen flex">
                {/* Left Side - Login Form */}
                <div className="flex-1 flex items-center justify-center bg-base-100 px-4 sm:px-6 lg:px-8">
                    <div className="w-full max-w-md">
                        {/* Back Navigation */}
                        <div className="mb-6" data-aos="fade-down">
                            <button
                                onClick={() => window.history.length > 1 ? window.history.back() : router.visit('/')}
                                className="btn btn-ghost btn-sm gap-2"
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
                                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                    />
                                </svg>
                                Kembali
                            </button>
                        </div>

                        {/* Logo/Brand */}
                        <div className="text-center mb-8" data-aos="fade-down">
                            <Link href="/" className="inline-block">
                                <h1 className="text-3xl font-bold text-primary">PKBM Dabohaley</h1>
                                <p className="text-sm text-base-content/70 mt-1">Sistem Informasi Pendidikan</p>
                            </Link>
                        </div>

                        {/* Login Card */}
                        <div className="card bg-base-100 shadow-xl" data-aos="fade-up">
                            <div className="card-body">
                                <h2 className="card-title text-2xl mb-2">Selamat Datang Kembali</h2>
                                <p className="text-base-content/70 mb-6">Silakan login untuk melanjutkan</p>

                        {status && <Alert variant="success" className="mb-4">{status}</Alert>}

                                <form onSubmit={submit} className="space-y-4">
                                    <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input
                        type="email"
                        value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                                    placeholder="email@example.com"
                        autoComplete="username"
                                    autoFocus
                                />
                                {errors.email && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.email}</span>
                                    </label>
                                )}
                </div>

                                    <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <input
                        type="password"
                        value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
                                    placeholder="Masukkan password"
                        autoComplete="current-password"
                                />
                                {errors.password && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.password}</span>
                                    </label>
                                )}
                </div>

                                    <div className="flex items-center justify-between">
                                <label className="label cursor-pointer justify-start gap-2">
                                    <input
                                        type="checkbox"
                            checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                                className="checkbox checkbox-primary checkbox-sm"
                        />
                                            <span className="label-text text-sm">Remember me</span>
                    </label>

                    {canResetPassword && (
                                    <Link href={route('password.request')} className="link link-primary text-sm">
                                        Lupa password?
                        </Link>
                                        )}
                                    </div>

                                    <div className="form-control mt-6">
                                        <Button type="submit" variant="primary" className="w-full" loading={processing}>
                                            {processing ? 'Memproses...' : 'Login'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 text-center text-sm text-base-content/70">
                            <p>
                                &copy; {new Date().getFullYear()} PKBM Dabohaley. All rights reserved.
                                <br />
                                <span>Dikelola oleh <strong>Syull Wally</strong></span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Visual Content */}
                <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary to-secondary items-center justify-center p-12 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10 text-center text-white max-w-lg" data-aos="fade-left">
                        <div className="mb-8">
                            <h1 className="text-5xl font-bold mb-4">PKBM Dabohaley</h1>
                            <p className="text-xl mb-2">Pusat Kegiatan Belajar Masyarakat</p>
                            <p className="text-lg opacity-90">
                                Website Promosi Pendidikan PKBM Dabohaley - Mari bersama-sama membangun pendidikan yang lebih baik untuk masyarakat.
                            </p>
                        </div>
                        
                        <div className="mt-12 space-y-6">
                            <div className="flex items-center gap-4 justify-center">
                                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-8 w-8"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                        />
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <h3 className="font-semibold text-lg">Program Pendidikan</h3>
                                    <p className="text-sm opacity-90">Berbagai program pendidikan untuk semua kalangan</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 justify-center">
                                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-8 w-8"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                        />
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <h3 className="font-semibold text-lg">Kegiatan Masyarakat</h3>
                                    <p className="text-sm opacity-90">Aktifitas pembelajaran dan kegiatan sosial</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 justify-center">
                                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-8 w-8"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <h3 className="font-semibold text-lg">Terpercaya & Terakreditasi</h3>
                                    <p className="text-sm opacity-90">Lembaga pendidikan non formal yang terpercaya</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                </div>
            </div>
        </>
    );
}

