   <!-- Page Heading -->
       <div class="upload_topmenu_wrapper">
        <div class="upload_topmenu">
            <div class="logo-image">
                <a href="{{ route('dashboard') }}">
                    <img src="{{ asset('assets/image/Logo A1.png') }}" alt="Logo Image">

                </a>
            </div>
                            @auth

            <div class="menu-and-cart-container">
                @hasrole('retailer')
                <div class="cart-container">
                    <object type="image/svg+xml" data="{{ asset('assets/svg/add-to-cart.svg') }}"></object>
                </div>
                @endhasrole
                     <div class="menu-container" id="menuToggle">
                    <img src="{{ asset('assets/svg/hamburger-menu.svg') }}" alt="menu" class="hamburger-menu_image">
                </div>
               
            </div>
                            @endauth


            <div id="sideMenu" class="side-menu">
                <span class="closeBtn" id="closeMenu">✕</span>
                <a href="{{ route('explore.index') }}" id="exploreLink">Explore</a>
                <a href="{{ route('retailer.dashboard') }}" id="dashboardLink">Dashboard</a>
                <a href="{{ route('retailer.catalogue') }}">Catalogue</a>
                <a href="{{ route('retailer.orders') }}">Orders</a>
                <a href="{{ route('retailer.messages') }}">Messages</a>
                <a href="{{ route('retailer.account') }}">Account</a>
                <a href="{{ route('retailer.payment-shipping') }}">Payment & Shipping</a>
                <a href="{{ route('retailer.help-center') }}">Help Center</a>
                <a href="{{ route('retailer.faq') }}">FAQ</a>
                <hr style="margin: 10px 0;">
                <form method="POST" action="{{ route('logout') }}" style="display: inline;">
                    @csrf
                    <button type="submit" style="background: none; border: none; color: inherit; cursor: pointer; font-size: inherit; padding: 0; margin-left: 20px; width: auto; text-align: left; font-family: inherit; text-decoration: none;">
                        Logout
                    </button>
                </form>
            </div>
            <script>
                // Hide Dashboard link when on dashboard page
                if (window.location.pathname.includes('/retailer/dashboard')) {
                    document.getElementById('dashboardLink').style.display = 'none';
                }
            </script>
        </div>
    </div>