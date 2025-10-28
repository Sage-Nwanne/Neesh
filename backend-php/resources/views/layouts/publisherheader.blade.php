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
                <a href="{{ route('explore.index') }}">Explore</a>
                <a href="{{ route('publisher.dashboard') }}">Dashboard</a>
                <a href="{{ route('publisher.catalogue') }}">Catalogue</a>
                <a href="{{ route('publisher.orders') }}">Orders</a>
                <a href="{{ route('publisher.messages') }}">Messages</a>
                <a href="{{ route('publisher.account') }}">Account</a>
                <a href="{{ route('publisher.help-center') }}">Help Center</a>
                <a href="{{ route('publisher.faq') }}">FAQ</a>
                <hr style="margin: 10px 0;">
                <form method="POST" action="{{ route('logout') }}" style="display: inline;">
                    @csrf
                    <button type="submit" style="background: none; border: none; color: inherit; cursor: pointer; font-size: inherit; padding: 0; margin-left: 20px; width: auto; text-align: left; font-family: inherit; text-decoration: none;">
                        Logout
                    </button>
                </form>
            </div>
        </div>
    </div>