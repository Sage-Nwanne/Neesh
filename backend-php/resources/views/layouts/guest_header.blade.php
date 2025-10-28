<!-- Guest Header (Unauthenticated Users) -->
<div class="upload_topmenu_wrapper">
    <div class="upload_topmenu">
        <div class="logo-image">
            <a href="{{ route('explore.index') }}">
                <img src="{{ asset('assets/image/Logo A1.png') }}" alt="Logo Image">
            </a>
        </div>

        <div class="menu-and-cart-container">
            <div class="menu-container" id="menuToggle">
                <img src="{{ asset('assets/svg/hamburger-menu.svg') }}" alt="menu" class="hamburger-menu_image">
            </div>
        </div>

        <div id="sideMenu" class="side-menu">
            <span class="closeBtn" id="closeMenu">✕</span>
            <a href="https://neesh.art">Home</a>
            <a href="{{ route('explore.index') }}">Explore</a>
            <a href="{{ route('help-center') }}">Help Center</a>
            <a href="{{ route('faq') }}">FAQ</a>
            <a href="{{ route('login') }}">Login</a>
        </div>
    </div>
</div>

