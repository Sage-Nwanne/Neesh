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
                <div style="padding-top: 20px;">
                    <a href="{{ route('explore.index') }}">Explore</a>
                    <a href="{{ route('admin.users') }}">Users</a>
                    <a href="{{ route('admin.messages') }}">Messages</a>
                    <a href="{{ route('admin.account') }}">Account</a>
                    <form method="POST" action="{{ route('logout') }}" style="display: inline;">
                        @csrf
                        <button type="submit" style="background: none; border: none; color: inherit; cursor: pointer; font-size: inherit; padding: 0; width: auto; text-align: left; font-family: inherit; text-decoration: none; display: block; margin-top: 10px;">
                            Logout
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>