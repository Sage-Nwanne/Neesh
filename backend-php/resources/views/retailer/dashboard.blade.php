
@extends('layouts.app')

@section('title', 'Dashboard')
@section('content')
    
      <div class="login_new_to_nessh_back_arrow_container">
          <a href="{{ route('retailer.catalogue') }}" class="login_new_to_nessh_back_arrow">
              <div class="back_navigation_title">
                  <img src="{{ asset('assets/image/left arrow.png') }}" alt="Back Arrow">
              </div>
              <h2 class="my_title">Browse Catalogue</h2>
          </a>
      </div>

      <div class="page__container page-width">
          <div class="page-wrap">
              <div class="photostack-container" aria-label="Magazine stack">
                  <div class="photo-item">
                      <div class="save_image">
                          <img src="{{ asset('assets/image/save.png') }}">
                      </div>
                      <a href="#" class="Catalogue_anchour"><img src="{{ asset('assets/image/Catalogue 1.png') }}"
                              alt="Cover 1">
                          <div class="Catalogue_visible_text">
                              <div class="product_info">
                                  <span class="product_vendor">WW Issue 08</span>
                                  <h3 class="product_title">Weird Walk</h3>
                                  <div class="catalogue_country_and_image_container">
                                      <p>UK</p>
                                      <div class="country_and_image_container_image">
                                          <img src="{{ asset('assets/image/h Image.png') }}">
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </a>
                  </div>

                  <div class="photo-item">
                      <div class="save_image">
                          <img src="{{ asset('assets/image/save.png') }}">
                      </div>
                      <a href="#" class="Catalogue_anchour"><img
                              src="{{ asset('assets/image/Catalogue 2.png') }}" alt="Cover 2">
                          <div class="Catalogue_visible_text">
                              <div class="product_info">
                                  <span class="product_vendor">Catnip Vol 1</span>
                                  <h3 class="product_title">Broccoli</h3>
                                  <div class="catalogue_country_and_image_container">
                                      <p>Portland, OR</p>
                                      <div class="country_and_image_container_image">
                                          <img src="{{ asset('assets/image/h Image.png') }}">
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </a>
                  </div>
                  <div class="photo-item">
                      <div class="save_image">
                          <img src="{{ asset('assets/image/save.png') }}">
                      </div>
                      <a href="#" class="Catalogue_anchour"><img
                              src="{{ asset('assets/image/Catalogue 3.png') }}" alt="Cover 3">
                          <div class="Catalogue_visible_text">
                              <div class="product_info">
                                  <span class="product_vendor">Lunch Lady Issue 30</span>
                                  <h3 class="product_title">Lunch Lady</h3>
                                  <div class="catalogue_country_and_image_container">
                                      <p>Australia</p>
                                      <div class="country_and_image_container_image">
                                          <img src="{{ asset('assets/image/h Image.png') }}">
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </a>
                  </div>
                  <div class="photo-item">
                      <div class="save_image">
                          <img src="{{ asset('assets/image/save.png') }}">
                      </div>
                      <a href="#" class="Catalogue_anchour"><img
                              src="{{ asset('assets/image/Catalogue 4.png') }}" alt="Cover 4">
                          <div class="Catalogue_visible_text">
                              <div class="product_info">
                                  <span class="product_vendor">Mildew Issue 03</span>
                                  <h3 class="product_title">Broccoli</h3>
                                  <div class="catalogue_country_and_image_container">
                                      <p>Portland, OR</p>
                                      <div class="country_and_image_container_image">
                                          <img src="{{ asset('assets/image/h Image.png') }}">
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </a>
                  </div>
                  <div class="photo-item">
                      <div class="save_image">
                          <img src="{{ asset('assets/image/save.png') }}">
                      </div>
                      <a href="#" class="Catalogue_anchour"><img
                              src="{{ asset('assets/image/Catalogue 5.png') }}" alt="Cover 5">
                          <div class="Catalogue_visible_text">
                              <div class="product_info">
                                  <span class="product_vendor">Cheese Issue 03</span>
                                  <h3 class="product_title">Cheese Magazine</h3>
                                  <div class="catalogue_country_and_image_container">
                                      <p>UK</p>
                                      <div class="country_and_image_container_image">
                                          <img src="{{ asset('assets/image/h Image.png') }}">
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </a>
                  </div>
                  <div class="photo-item">
                      <div class="save_image">
                          <img src="{{ asset('assets/image/save.png') }}">
                      </div>
                      <a href="#" class="Catalogue_anchour"><img
                              src="{{ asset('assets/image/Catalogue 6.png') }}" alt="Cover 6">
                          <div class="Catalogue_visible_text">
                              <div class="product_info">
                                  <span class="product_vendor">Mushroom People</span>
                                  <h3 class="product_title">Broccoli</h3>
                                  <div class="catalogue_country_and_image_container">
                                      <p>Portland, OR</p>
                                      <div class="country_and_image_container_image">
                                          <img src="{{ asset('assets/image/h Image.png') }}">
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </a>
                  </div>
              </div>
          </div>

          <div class="home_catalogue">
              <div class="full_catalogue">
                  Full Catalogue
              </div>
              <div class="home_page_catalogue_collection_icons">
                  <div class="home_page_catalogue_icon_contaienr">
                      <div class="home_page_catalogue_icon_innercontaienr">
                          <img src="{{ asset('assets/image/Eye.png') }}" alt="Eye Icon">

                      </div>
                  </div>
                  <div class="home_page_catalogue_icon_contaienr">
                      <div class="home_page_catalogue_icon_innercontaienr">
                          <img src="{{ asset('assets/image/Search.png') }}" alt="Eye Icon">

                      </div>
                  </div>
                  <div class="home_page_catalogue_icon_contaienr">
                      <div class="home_page_catalogue_icon_innercontaienr">
                          <img src="{{ asset('assets/image/top-bottom-arrrow.png') }}" alt="Eye Icon">

                      </div>
                  </div>
                  <div class="home_page_catalogue_icon_contaienr">
                      <div class="home_page_catalogue_icon_innercontaienr">
                          <img src="{{ asset('assets/image/Left Right Filter.png') }}" alt="Eye Icon">

                      </div>
                  </div>
              </div>
          </div>



          <div class="collection" style="padding: 20px;">
          @forelse($magazines as $magazine)
              <a href="{{ route('magazines.show', $magazine->id) }}" class="product-card product-card-underline">
                  {{-- Agar image hai to first image dikhao, warna placeholder --}}
                  @if ($magazine->images->first())
                      <img src="{{ asset('storage/' . $magazine->images->first()->image_path) }}"
                          alt="{{ $magazine->title_name }}" onerror="this.src='{{ asset('magazine-placeholder.png') }}'">
                  @else
                      <img src="{{ asset('magazine-placeholder.png') }}" alt="No Image">
                  @endif

                  <div class="product_info">
                      <span class="product_vendor">
                          {{ $magazine->issue_identifier ?? 'Single Issue' }}
                      </span>

                      <div class="title_and_country">
                          <h3 class="product_title">{{ $magazine->title_name }}</h3>
                          <p>{{ $magazine->warehouse ?? '' }}</p>
                      </div>

                      <span class="product_price">
                          ${{ number_format($magazine->msrp, 2) }}
                      </span>
                  </div>
              </a>
          @empty
              <p>No magazines found for this publisher.</p>
          @endforelse
      </div>

      </div>

@endsection

