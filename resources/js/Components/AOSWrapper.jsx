import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import AOS from 'aos';

export default function AOSWrapper({ children }) {
    const { url } = usePage();

    useEffect(() => {
        // Refresh AOS when route changes
        AOS.refresh();
    }, [url]);

    return <>{children}</>;
}

