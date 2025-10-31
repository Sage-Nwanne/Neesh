<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Product Gallery - Clone</title>
    <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}?v={{ time() }}">
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
                        @if ($magazine->images->count() > 0)
                            @foreach ($magazine->images as $key => $image)
                                <img src="{{ asset('storage/' . $image->image_path) }}" data-index="{{ $key }}"
                                    class="main-img" style="{{ $key === 0 ? '' : 'opacity:0;transform:scale(1.02)' }}"
                                    alt="{{ $magazine->title_name }}">
                            @endforeach
                        @else
                            <img src="{{ asset('magazine-placeholder.png') }}" data-index="0"
                                class="main-img"
                                alt="{{ $magazine->title_name }}">
                        @endif

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
                        @if ($magazine->images->count() > 0)
                            @foreach ($magazine->images as $key => $image)
                                <button class="thumb {{ $key === 0 ? 'active' : '' }}" data-index="{{ $key }}">
                                    <img src="{{ asset('storage/' . $image->image_path) }}"
                                        alt="Thumbnail {{ $key + 1 }}">
                                </button>
                            @endforeach
                        @else
                            <button class="thumb active" data-index="0">
                                <img src="{{ asset('magazine-placeholder.png') }}"
                                    alt="Placeholder">
                            </button>
                        @endif
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
                        @hasrole('publisher')
                            @if($magazine->archived_at)
                                <button class="action-btn archive-btn" data-magazine-id="{{ $magazine->id }}" data-action="unarchive">
                                    <span>Unarchive</span>
                                    <img src="{{ asset('assets/image/Qr code.png') }}" alt="Unarchive Icon">
                                </button>
                            @else
                                <button class="action-btn archive-btn" data-magazine-id="{{ $magazine->id }}" data-action="archive">
                                    <span>Archive</span>
                                    <img src="{{ asset('assets/image/Qr code.png') }}" alt="Archive Icon">
                                </button>
                            @endif
                        @else
                            <button class="action-btn share-btn" data-magazine-id="{{ $magazine->id }}" data-magazine-title="{{ $magazine->title_name }}">
                                <span>Copy info</span>
                                <img src="{{ asset('assets/image/Qr code.png') }}" alt="Copy Icon">
                            </button>
                        @endhasrole
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
        @if($relatedMagazines->count() > 0)
        <div class="relative_collection-wrapper">
            <h2 class="relative_product_title">
                Explore similar titles
            </h2>
            <div class="collection">
                @foreach($relatedMagazines as $relatedMagazine)
                <a href="{{ route('magazines.show', $relatedMagazine->id) }}" class="product-card relative-product product-card-underline">
                    @if ($relatedMagazine->images->first())
                        <img src="{{ asset('storage/' . $relatedMagazine->images->first()->image_path) }}" alt="{{ $relatedMagazine->title_name }}" onerror="this.src='{{ asset('magazine-placeholder.png') }}'">
                    @else
                        <img src="{{ asset('magazine-placeholder.png') }}" alt="No Image">
                    @endif
                    <div class="product_info">
                        <span class="product_vendor">{{ $relatedMagazine->issue_identifier ?? 'Single Issue' }}</span>
                        <div class="title_and_country">
                            <h3 class="product_title">{{ $relatedMagazine->title_name }}</h3>
                            <p>{{ $relatedMagazine->warehouse ?? '' }}</p>
                        </div>
                        <span class="product_price">${{ number_format($relatedMagazine->msrp, 2) }}</span>
                    </div>
                </a>
                @endforeach
            </div>
        </div>
        @endif


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
                    <a href="{{ route('checkout.index') }}" id="checkoutBtn" class="cart-checkout">Checkout</a>
                </div>
            </div>
        </aside>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const archiveButtons = document.querySelectorAll('.archive-btn');

            archiveButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    const magazineId = this.dataset.magazineId;
                    const action = this.dataset.action;
                    const actionText = action === 'archive' ? 'archive' : 'unarchive';
                    const confirmText = action === 'archive'
                        ? 'Are you sure you want to archive this title?'
                        : 'Unarchive?';
                    const confirmBtn = action === 'archive' ? 'Im sure' : 'Im sure';
                    const cancelBtn = action === 'archive' ? 'Cancel Archive' : 'Keep Archived';

                    // Create modal
                    const modal = document.createElement('div');
                    modal.style.cssText = `
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.5);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 9999;
                    `;

                    const modalContent = document.createElement('div');
                    modalContent.style.cssText = `
                        background: white;
                        padding: 30px;
                        border-radius: 8px;
                        text-align: center;
                        max-width: 400px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    `;

                    const title = document.createElement('h3');
                    title.textContent = confirmText;
                    title.style.cssText = 'margin-bottom: 20px; font-size: 18px; color: #333;';

                    const buttonContainer = document.createElement('div');
                    buttonContainer.style.cssText = 'display: flex; gap: 10px; justify-content: center;';

                    const confirmBtnEl = document.createElement('button');
                    confirmBtnEl.textContent = confirmBtn;
                    confirmBtnEl.style.cssText = `
                        padding: 10px 20px;
                        background: #000;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-weight: bold;
                    `;

                    const cancelBtnEl = document.createElement('button');
                    cancelBtnEl.textContent = cancelBtn;
                    cancelBtnEl.style.cssText = `
                        padding: 10px 20px;
                        background: #ccc;
                        color: #333;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-weight: bold;
                    `;

                    confirmBtnEl.addEventListener('click', function() {
                        // Submit the form
                        const form = document.createElement('form');
                        form.method = 'POST';
                        form.action = action === 'archive'
                            ? `/publisher/magazines/${magazineId}/archive`
                            : `/publisher/magazines/${magazineId}/unarchive`;

                        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
                        const csrfInput = document.createElement('input');
                        csrfInput.type = 'hidden';
                        csrfInput.name = '_token';
                        csrfInput.value = csrfToken;

                        form.appendChild(csrfInput);
                        document.body.appendChild(form);
                        form.submit();
                    });

                    cancelBtnEl.addEventListener('click', function() {
                        document.body.removeChild(modal);
                    });

                    buttonContainer.appendChild(confirmBtnEl);
                    buttonContainer.appendChild(cancelBtnEl);

                    modalContent.appendChild(title);
                    modalContent.appendChild(buttonContainer);
                    modal.appendChild(modalContent);

                    document.body.appendChild(modal);
                });
            });
        });
    </script>

</body>

</html>
