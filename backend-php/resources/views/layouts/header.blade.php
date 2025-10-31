   <!-- Page Heading -->
       <div class="upload_topmenu_wrapper">
        <div class="upload_topmenu">
            <div class="logo-image">
                <a href="{{ \App\Helpers\RouteHelper::getDashboardRoute() }}">
                    <img src="{{ asset('assets/image/Logo A1.png') }}" alt="Logo Image">

                </a>
            </div>
                            @auth

            <div class="menu-and-cart-container">
                <div class="menu-container" id="menuToggle">
                    <img src="{{ asset('assets/svg/hamburger-menu.svg') }}" alt="menu" class="hamburger-menu_image">
                </div>
            </div>
                            @endauth


            <div id="sideMenu" class="side-menu">
                <span class="closeBtn" id="closeMenu">✕</span>
                <a href="{{ route('explore.index') }}" id="exploreLink">Explore</a>
                @auth
                    <a href="{{ \App\Helpers\RouteHelper::getDashboardRoute() }}" id="dashboardLink">Dashboard</a>
                    @if(auth()->user()->hasRole('retailer'))
                        <a href="{{ route('retailer.catalogue') }}">Catalogue</a>
                        <a href="{{ route('retailer.orders') }}">Orders</a>
                        <a href="{{ route('retailer.messages') }}">Messages</a>
                        <a href="{{ route('retailer.account') }}">Account</a>
                        <a href="{{ route('retailer.payment-shipping') }}">Payment & Shipping</a>
                        <a href="{{ route('retailer.help-center') }}">Help Center</a>
                        <a href="{{ route('retailer.faq') }}">FAQ</a>
                    @elseif(auth()->user()->hasRole('publisher'))
                        <a href="{{ route('publisher.catalogue') }}">Catalogue</a>
                        <a href="{{ route('publisher.orders') }}">Orders</a>
                        <a href="{{ route('publisher.messages') }}">Messages</a>
                        <a href="{{ route('publisher.account') }}">Account</a>
                        <a href="{{ route('publisher.help-center') }}">Help Center</a>
                        <a href="{{ route('publisher.faq') }}">FAQ</a>
                    @elseif(auth()->user()->hasRole('admin'))
                        <a href="{{ route('admin.users') }}">Users</a>
                        <a href="{{ route('admin.applications') }}">Applications</a>
                        <a href="{{ route('admin.reports') }}">Reports</a>
                    @endif
                @endauth
                <hr style="margin: 10px 0;">
                @auth
                    <form method="POST" action="{{ route('logout') }}" style="display: inline;">
                        @csrf
                        <button type="submit" style="background: none; border: none; color: inherit; cursor: pointer; font-size: inherit; padding: 0; margin-left: 20px; width: auto; text-align: left; font-family: inherit; text-decoration: none;">
                            Logout
                        </button>
                    </form>
                @endauth
            </div>
            <script>
                // Hide Dashboard link when on dashboard page
                const dashboardLink = document.getElementById('dashboardLink');
                if (dashboardLink) {
                    const currentPath = window.location.pathname;
                    if (currentPath.includes('/retailer/dashboard') ||
                        currentPath.includes('/publisher/dashboard') ||
                        currentPath.includes('/admin/dashboard')) {
                        dashboardLink.style.display = 'none';
                    }
                }
            </script>
        </div>
    </div>