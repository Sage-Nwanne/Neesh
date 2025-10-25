<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Product Gallery - Clone</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}">
    <script src="{{ asset('assets/js/product-page.js') }}" defer></script>
    <script src="{{ asset('assets/js/menu.js') }}" defer></script>
</head>

<body>
    

    @include('layouts.header')
    <div class="product_heading_link">
        <a href="{{ url()->previous() }}" class="login_new_to_nessh_back_arrow">
            <div class="back_navigation_title">
                <img src="{{ asset('assets/image/left arrow.png') }}" alt="Back Arrow">
            </div>
            <h2 class="my_title">My Titles</h2>
        </a>
    </div>

    <div class="product-wrap_wrapper-wrapper page-width">
        <div class="product-wrap_wrapper">
            <div class="product-wrap">

                {{-- ====== IMAGE GALLERY ====== --}}
                <div class="gallery" aria-label="Product images gallery">
                    <div class="main-viewport" aria-live="polite">
                        @foreach ($magazine->images as $key => $image)
                            <img src="{{ asset('storage/' . $image->image_path) }}" data-index="{{ $key }}"
                                class="main-img" style="{{ $key === 0 ? '' : 'opacity:0;transform:scale(1.02)' }}"
                                alt="{{ $magazine->title_name }}">
                        @endforeach

                        {{-- 🔥 Missing controls added --}}
                        <div class="controls">
                            <button class="arrow prev" aria-label="Previous image">
                                <img src="{{ asset('assets/image/left arrow.png') }}">
                            </button>
                            <button class="arrow next" aria-label="Next image">
                                <img src="{{ asset('assets/image/right arrow.png') }}">
                            </button>
                        </div>
                    </div>

                    <div class="thumbs" role="tablist" aria-label="Thumbnails">
                        @foreach ($magazine->images as $key => $image)
                            <button class="thumb {{ $key === 0 ? 'active' : '' }}" data-index="{{ $key }}">
                                <img src="{{ asset('storage/' . $image->image_path) }}"
                                    alt="Thumbnail {{ $key + 1 }}">
                            </button>
                        @endforeach
                    </div>

                    <div class="action-buttons">
                        @hasrole('publisher')
                        <a href="{{route('publisher.magazines.edit' , $magazine->id)}}" class="action-btn">
                          <span>Edit</span>
                                <img src="{{ asset('assets/image/pencil.png') }}" alt="Mail Icon">
                          
                        </a>
                          
                        @endhasrole
                        @auth
                        <button class="action-btn bookmark-btn" data-magazine-id="{{ $magazine->id }}">
                            <span>Bookmark</span>
                            <img src="{{ asset('assets/image/black save icon.png') }}" alt="Bookmark Icon">
                        </button>
                        @else
                        <a href="{{ route('login') }}" class="action-btn">
                            <span>Bookmark</span>
                            <img src="{{ asset('assets/image/black save icon.png') }}" alt="Bookmark Icon">
                        </a>
                        @endauth
                        <button class="action-btn share-btn" data-magazine-id="{{ $magazine->id }}" data-magazine-title="{{ $magazine->title_name }}">
                            <span>Copy info</span>
                            <img src="{{ asset('assets/image/Qr code.png') }}" alt="Copy Icon">
                        </button>
                        @hasrole('retailer')
                            <button class="action-btn">
                                <span>Contact Publisher</span>
                                <img src="{{ asset('assets/image/email.png') }}" alt="Mail Icon">
                            </button>
                        @endhasrole


                    </div>
                </div>

                {{-- ====== PRODUCT DETAILS ====== --}}
                <div class="right_container">
                    <h2 class="product_title">{{ $magazine->title_name }}</h2>

                    <div class="product_special_infprmation_contaienr">
                        <p class="book_owner">{{ $magazine->publisher->user->name ?? 'Unknown Publisher' }}</p>
                        <p class="issue_no">{{ $magazine->issue_identifier }}</p>
                    </div>

                    <div class="product_special_infprmation_contaienr">
                        <p class="product_special_infprmation">{{ date('Y', strtotime($magazine->created_at)) }}</p>
                        <p class="product_special_infprmation">ISSN</p>
                    </div>

                    <div class="product_special_infprmation_contaienr">
                        <p class="product_special_infprmation">{{ $magazine->page_count }} pages</p>
                        <p class="product_special_infprmation">{{ $magazine->dimensions }}</p>
                    </div>

                    <div class="product_special_infprmation_contaienr">
                        <p class="product_special_infprmation">{{ $magazine->genre }}</p>
                        <p class="product_special_infprmation">{{ $magazine->specs }}</p>
                    </div>

                    <p class="product_disscription">{!! nl2br(e($magazine->description)) !!}</p>

                    <p class="price_text">Price</p>
                    <div class="price_container">
                        <div class="wsp_msrp_containers_wrapper">
                            <div class="wsp_price_wrapper">
                                <p class="wsp_container">WSP</p>
                                <p class="wsp_price">${{ number_format($magazine->wholesale_price, 2) }}</p>
                            </div>
                            <div class="msrp_price_wrapper">
                                <p class="msrp_text">MSRP</p>
                                <p class="msrp_price">${{ number_format($magazine->msrp, 2) }}</p>
                            </div>
                        </div>

                        <div class="my_margin_container">
                            <p class="my_margin_text">MY MARGIN</p>
                            <p class="my_margin_price">
                                ${{ number_format($magazine->msrp - $magazine->wholesale_price, 2) }}
                            </p>
                        </div>
                    </div>

                    {{-- 🔥 Added missing product-data --}}
                    <div class="product-data" data-product-id="{{ $magazine->id }}"
                        data-product-title="{{ $magazine->title_name }}"
                        data-product-price="{{ number_format($magazine->wholesale_price, 2) }}"
                        data-product-img="{{ asset('storage/' . ($magazine->images->first()->image_path ?? 'assets/image/placeholder.png')) }}">
                    </div>

                    @hasrole('retailer')
                        <div class="cart-component">
                            <div class="quantity-selector" data-quantity="1">
                                <button class="quantity-btn decrease" type="button"
                                    aria-label="Decrease quantity">−</button>
                                <span class="quantity-display">1</span>
                                <button class="quantity-btn increase" type="button"
                                    aria-label="Increase quantity">+</button>
                            </div>

                            <a class="add-to-cart" href="#" role="button">
                                <span>Add To Cart</span>
                                <i class="fa-solid fa-bag-shopping"></i>
                            </a>
                        </div>
                    @endhasrole

                </div>

            </div>
        </div>
        <div class="relative_collection-wrapper">
            <h2 class="relative_product_title">
                Explore similar titles
            </h2>
            <div class="collection">
                <a href="product2.html" class="product-card relative-product product-card-underline">
                    <img src="{{ asset('assets/image/Catalogue 1.png') }}" alt="Product 6">
                    <div class="product_info">
                        <span class="product_vendor">WW Issue 08</span>
                        <div class="title_and_country">
                            <h3 class="product_title">Weird Walk</h3>
                            <p>UK</p>
                        </div>
                        <span class="product_price">$ 8.81</span>
                    </div>
                </a>
                <a href="product2.html" class="product-card relative-product product-card-underline">
                    <img src="{{ asset('assets/image/Catalogue 6.png') }}" alt="Product 6">
                    <div class="product_info">
                        <span class="product_vendor">Catnip Vol 1</span>
                        <div class="title_and_country">
                            <h3 class="product_title">Broccoli</h3>
                            <p>Portland, OR</p>
                        </div>
                        <span class="product_price">$ 28.00</span>
                    </div>
                </a>
                <a href="#" class="product-card relative-product product-card-underline">
                    <img src="{{ asset('assets/image/Catalogue 6.png') }}" alt="Product 6">
                    <div class="product_info">
                        <span class="product_vendor">Mushroom People</span>
                        <div class="title_and_country">
                            <h3 class="product_title">Broccoli</h3>
                            <p>Portland, OR</p>
                        </div>
                        <span class="product_price">$ 28.00</span>
                    </div>
                </a>
                <a href="#" class="product-card relative-product product-card-underline">
                    <img src="{{ asset('assets/image/Catalogue 12.png') }}" alt="Product 6">
                    <div class="product_info">
                        <span class="product_vendor">Wild Alchemy Journal Issue No. 5: Aether</span>
                        <div class="title_and_country">
                            <h3 class="product_title">Mama Xanadu</h3>
                            <p>UK</p>
                        </div>
                        <span class="product_price">$ 35.00</span>
                    </div>
                </a>
            </div>
        </div>


        <div id="cartOverlay" class="cart-overlay" aria-hidden="true"></div>

        <aside id="cartDrawer" class="cart-drawer" aria-hidden="true">
            <div class="top_cartdrawer">
                <div class="cart-header">
                    <h3 class="cart-title">Your Cart</h3>
                    <button id="closeCart" class="cart-close" aria-label="Close cart">✕</button>
                </div>

                <div id="cartItems" class="cart-items"></div>
            </div>

            <div class="bottom_cartdrawer">
                <div class="cart-subtotal">
                    <strong>Subtotal</strong>
                    <strong id="subtotal">$0.00</strong>
                </div>

                <div class="cart-footer">
                    <a href="{{ route('checkout') }}" id="checkoutBtn" class="cart-checkout">Checkout</a>
                </div>
            </div>
        </aside>
    </div>

</body>

</html>
