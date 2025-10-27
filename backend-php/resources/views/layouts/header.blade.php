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
                <a href="#">Dashboard</a>
                <a href="#">Catalogue</a>
                <a href="#">Orders</a>
                <a href="#">Messages</a>
                <a href="#">Account</a>
                <a href="#">Help Center</a>
                <a href="#">FAQ</a>
            </div>
        </div>
    </div>