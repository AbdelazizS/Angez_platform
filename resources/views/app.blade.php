<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- SEO Meta Tags -->
    <title inertia>{{ config('app.name') }}</title>
    <meta name="description" content="منصة احترافية للخدمات الحرة تربط بين العملاء والمستقلين لإنجاز المشاريع بجودة واحترافية.">
    <meta name="keywords" content="خدمات, منصة, عمل حر, مستقلين, مشاريع, تطوير ويب, تصميم, برمجة">
    <meta name="author" content="Abdelaziz Mohammed">
    <meta name="robots" content="index, follow">

    <!-- Canonical URL -->
    <link rel="canonical" href="{{ url()->current() }}">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="{{ config('app.name', 'Laravel') }}">
    <meta property="og:description" content="اكتشف كيف يمكنك إطلاق مشروعك بسرعة مع أفضل المستقلين في منصة متكاملة.">
    <meta property="og:image" content="{{ asset('logo.png') }}">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:locale" content="{{ app()->getLocale() === 'ar' ? 'ar_AR' : 'en_US' }}">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ config('app.name', 'Laravel') }}">
    <meta name="twitter:description" content="منصة احترافية تربط أصحاب المشاريع بأفضل المستقلين.">
    <meta name="twitter:image" content="{{ asset('logo.png') }}">

    <!-- Favicon -->
    <link rel="icon" href="{{ asset('logo.png') }}" type="image/png">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Arabic Font Support -->
    @if(app()->getLocale() === 'ar')
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    @endif

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead

    <!-- RTL Styles -->
    <style>
        [dir="rtl"] [data-radix-popper-content-wrapper],
        [dir="rtl"] input,
        [dir="rtl"] textarea,
        [dir="rtl"] select,
        [dir="rtl"] .btn-icon,
        [dir="rtl"] .card-header,
        [dir="rtl"] .card-content,
        [dir="rtl"] table th,
        [dir="rtl"] table td {
            text-align: right;
        }

        [dir="rtl"] .sidebar-right {
            right: 0;
            left: auto;
        }

        [dir="rtl"] .sidebar-left {
            left: 0;
            right: auto;
        }

        [dir="rtl"] .rtl-flip {
            transform: scaleX(-1);
        }
    </style>
</head>
