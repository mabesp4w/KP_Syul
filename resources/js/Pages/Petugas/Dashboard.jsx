import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Card, { CardBody, CardHeader, CardTitle } from '@/Components/ui/Card';
import Badge from '@/Components/ui/Badge';
import Button from '@/Components/ui/Button';

export default function PetugasDashboard({ auth }) {
    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="text-xl font-semibold leading-tight text-base-content">
                    Dashboard Petugas
                </h2>
            }
        >
            <Head title="Dashboard Petugas" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <div className="alert alert-success">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 shrink-0 stroke-current"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span>Selamat datang, {auth.user.name}! Anda login sebagai Petugas.</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardBody>
                                <CardTitle className="text-lg">Tugas Saya</CardTitle>
                                <p className="text-3xl font-bold">0</p>
                                <Badge variant="primary" className="mt-2">
                                    Baru
                                </Badge>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardBody>
                                <CardTitle className="text-lg">Selesai</CardTitle>
                                <p className="text-3xl font-bold">0</p>
                                <Badge variant="success" className="mt-2">
                                    Hari ini
                                </Badge>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardBody>
                                <CardTitle className="text-lg">Pending</CardTitle>
                                <p className="text-3xl font-bold">0</p>
                                <Badge variant="warning" className="mt-2">
                                    Menunggu
                                </Badge>
                            </CardBody>
                        </Card>
                    </div>

                    <div className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <div className="flex flex-wrap gap-4">
                                    <Button variant="primary">Tugas Baru</Button>
                                    <Button variant="secondary">Lihat Tugas</Button>
                                    <Button variant="accent">Riwayat</Button>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

