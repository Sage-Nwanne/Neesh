@extends('layouts.app')

@section('title', 'Checkout')



@section('content')
    <div class="product_heading_link">
        <a href="{{ url()->previous() }}" class="login_new_to_nessh_back_arrow">
            <div class="back_navigation_title">
                <img src="{{ asset('assets/image/left arrow.png') }}" alt="Back Arrow">
            </div>
            <h2 class="my_title">Checkout</h2>
        </a>
    </div>
    <div class="checkout-wrapper page-width">
        <div class="checkout__container">
            <div class="checkout__left">
                <div class="checkout__accordion">
                    <div class="checkout__accordion-header-wrapper">
                        <label class="checkout__accordion-header" for="checkout__shipToggle">
                            <span class="checkout__accordion-header_text">Ship to</span>
                            <img src="{{ asset('assets/image/Button_Arrows__1_-removebg-preview.png') }}">
                        </label>
                        <input type="checkbox" class="checkout__toggle" id="checkout__shipToggle" checked>


                        <div class="checkout__accordion-content">
                            <div class="checkout__address-card">
                                @php
                                    $user = Auth::user();
                                    $retailerProfile = $user->retailerProfile;
                                    $address = $retailerProfile?->addresses()->latest()->first();
                                @endphp

                                <div class="checkout_text_icon_container">
                                    <strong class="checkout_strong">{{ $user->name }}</strong>

                                    <small class="checkout-small">
                                        @if ($address)
                                            {{ $address->address_line1 ?? '' }} {{ $address->address_line2 ?? '' }}<br>
                                            {{ $address->city ?? '' }} {{ $address->state ?? '' }},
                                            {{ $address->zip_code ?? '' }} {{ $address->country ?? '' }}
                                        @else
                                            <em>No address found</em>
                                        @endif
                                    </small>

                                    <div class="checkout_editimage_container">
                                        <img src="{{ asset('assets/image/pencil.jpg') }}" alt="Edit"
                                            style="cursor:pointer;" id="editAddressBtn">
                                    </div>
                                </div>


                                <div class="checkout__default-btn-wrapper">
                                    <a href="#" class="checkout__default-btn">Default</a>
                                    <a href="#" class="checkout__add-remove">+ Add or Remove Address</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="checkout__accordion">
                    <div class="checkout__accordion-header-wrapper">
                        <label class="checkout__accordion-header" for="checkout__shippingToggle">
                            <span class="checkout__accordion-header_text">Shipping Method</span>
                            <img src="{{ asset('assets/image/Button_Arrows__1_-removebg-preview.png') }}">
                        </label>
                        <input type="checkbox" class="checkout__toggle" id="checkout__shippingToggle" checked>
                        <div class="checkout__accordion-content">
                            <div class="checkout__shipping-card">
                                <div class="checkout_text_icon_container">
                                    <strong class="checkout_strong">USPS Ground</strong>
                                    <div class="standard_checkout"><span>STANDARD</span>
                                        <div class="checkout_prices_container">
                                            <span>$3.60</span>
                                            <small class="checkout-small">$1.20 / oz</small>
                                        </div>
                                    </div>
                                    <div class="checkout_editimage_container">
                                        <img src="{{ asset('assets/image/pencil.jpg') }}">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="checkout__accordion">
                    <div class="checkout__accordion-header-wrapper">
                        <label class="checkout__accordion-header" for="checkout__paymentToggle">
                            <span class="checkout__accordion-header_text"> Payment Method</span>
                            <img src="{{ asset('assets/image/Button_Arrows__1_-removebg-preview.png') }}">
                        </label>
                        <input type="checkbox" class="checkout__toggle" id="checkout__paymentToggle" checked>
                        <div class="checkout__accordion-content">
                            <div class="checkout__payment-card">
                                <div class="checkout_text_icon_container">
                                    <strong class="checkout_strong">VISA **** 8888</strong>
                                    <small class="checkout-small">
                                        Retailer Name<br>
                                        000 Street Address, Ave<br>
                                        12 Pallet Town Blvd Suite 03, Pe
                                    </small>
                                    <div class="checkout_editimage_container">
                                        <img src="{{ asset('assets/image/pencil.jpg') }}">
                                    </div>
                                </div>
                                <div class="checkout__default-btn-wrapper">
                                    <a href="#" class="checkout__default-btn">Default</a>
                                    <a href="#" class="checkout__add-remove">+ Add or Remove Address</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>

        <div class="checkout-right">
            <div class="top-bottom-main">

                <div class="cart-title" id="cartTitle">Cart</div>

                <div id="cartList"></div>

                <div class="bottom-div-main">
                    <div class="summary" id="summaryBox">
                        <div class="summary-row">
                            <span>Subtotal</span>
                            <span id="subtotalText">$0.00</span>
                        </div>
                        <div class="summary-row">
                            <span>Shipping</span>
                            <span id="shippingText">$3.60</span>
                        </div>
                        <div class="summary-row total">
                            <span>TOTAL</span>
                            <span id="totalText">$0.00</span>
                        </div>
                    </div>

                    <button class="pay-btn" id="payBtn">Pay Now</button>
                </div>

            </div>
        </div>

        <!-- Modal -->


        <div id="editAddressModal" class="modal-backdrop">
            <div class="modal-content">
                <h3>Edit Address</h3>

                <form action="{{ route('retailer.address.update') }}" method="POST">
                    @csrf
                    @method('PUT')

                    <input type="hidden" name="address_id" value="{{ $address?->id }}">

                    <div>
                        <label for="address_line1">Address Line 1:</label>
                        <input type="text" name="address_line1" id="address_line1"
                            value="{{ old('address_line1', $address->address_line1 ?? '') }}" required>
                    </div>

                    <div>
                        <label for="address_line2">Address Line 2:</label>
                        <input type="text" name="address_line2" id="address_line2"
                            value="{{ old('address_line2', $address->address_line2 ?? '') }}">
                    </div>

                    <div>
                        <label for="city">City:</label>
                        <input type="text" name="city" id="city"
                            value="{{ old('city', $address->city ?? '') }}" required>
                    </div>

                    <div>
                        <label for="state">State:</label>
                        <input type="text" name="state" id="state"
                            value="{{ old('state', $address->state ?? '') }}">
                    </div>

                    <div>
                        <label for="zip_code">ZIP Code:</label>
                        <input type="text" name="zip_code" id="zip_code"
                            value="{{ old('zip_code', $address->zip_code ?? '') }}">
                    </div>

                    <div>
                        <label for="country">Country:</label>
                        <input type="text" name="country" id="country"
                            value="{{ old('country', $address->country ?? '') }}">
                    </div>

                    <div class="modal-buttons">
                        <button type="submit">Update Address</button>
                        <button type="button" id="closeModalBtn">Cancel</button>
                    </div>
                </form>
            </div>
        </div>


    </div>
@endsection
