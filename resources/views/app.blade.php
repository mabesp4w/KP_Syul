<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" data-theme="bumblebee">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Dabohaley') }}</title>

    <!-- SEO Meta Tags -->
    <meta name="author" content="Syull Wally">
    <meta name="description"
        content="PKBM Dabohaley - Pusat Kegiatan Belajar Masyarakat yang menyediakan berbagai program pendidikan untuk masyarakat. Dikelola oleh Syull Wally.">
    <meta name="keywords"
        content="PKBM Dabohaley, pendidikan, belajar masyarakat, Syull Wally, pendidikan non formal, paket A, paket B, paket C, PAUD">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="{{ url()->current() }}">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="PKBM Dabohaley">
    <meta property="og:author" content="Syull Wally">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:creator" content="@SyullWally">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
