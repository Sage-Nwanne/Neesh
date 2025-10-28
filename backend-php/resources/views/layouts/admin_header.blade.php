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
                <a href="{{ route('explore.index') }}">Explore</a>
                <a href="{{ route('admin.users') }}">Users</a>
                <a href="{{ route('admin.messages') }}">Messages</a>
                <a href="{{ route('admin.account') }}">Account</a>
                <hr style="margin: 10px 0;">
                <form method="POST" action="{{ route('logout') }}" style="display: inline;">
                    @csrf
                    <button type="submit" style="background: none; border: none; color: #d32f2f; cursor: pointer; font-size: 16px; padding: 10px 0; width: 100%; text-align: left;">
                        🚪 Logout
                    </button>
                </form>
            </div>
        </div>
    </div>