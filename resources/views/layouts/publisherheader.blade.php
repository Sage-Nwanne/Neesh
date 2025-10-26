   <!-- Page Heading -->
       <div class="upload_topmenu_wrapper">
        <div class="upload_topmenu">
            <div class="logo-image">
                <a href="{{ route('dashboard') }}">
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
                <a href="{{ route('discover.index') }}">Discover</a>
                <a href="{{ route('publisher.dashboard') }}">Dashboard</a>
                <a href="{{ route('publisher.catalogue') }}">Catalogue</a>
                <a href="{{ route('publisher.orders') }}">Orders</a>
                <a href="{{ route('publisher.messages') }}">Messages</a>
                <a href="{{ route('publisher.account') }}">Account</a>
                <a href="{{ route('publisher.help-center') }}">Help Center</a>
                <a href="{{ route('publisher.faq') }}">FAQ</a>
            </div>
        </div>
    </div>