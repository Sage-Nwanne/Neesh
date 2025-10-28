  <!DOCTYPE html>
  <html lang="en">

  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Dashboard </title>
      <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}?v={{ time() }}">
      <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}">

      <script src="{{ asset('assets/js/menu.js') }}"></script>
      <script src="{{ asset('assets/js/dashboard.js') }}" defer></script>
      <style>
          .collection {
              display: flex;
              flex-wrap: wrap;
              justify-content: flex-start;
              gap: 20px;
          }

          .product-card:hover .underline {
              width: 100%;
              height: 2px;
              background-color: black;
          }

          .product-card {
              flex: 1 1 calc(16.66% - 20px);
              max-width: calc(16.66% - 20px);
              display: flex;
              flex-direction: column;
              text-decoration: none;
              color: #222;
              background: #fff;
              border: 1px solid #eee;
              overflow: hidden;
              position: relative;
              transition: all 0.3s ease;
          }

          .product-card:hover {
              box-shadow: 0 8px 8px rgba(0, 0, 0, 0.25);
              opacity: 0.8;
          }

          .product-card:hover::after {
              transform: scaleX(1);
          }

          .product-card img {
              width: 100%;
              height: auto;
              display: block;
              aspect-ratio: 1/1.3;
          }

          .product_info {
              padding: 12px;
          }

          .product_vendor {
              font-size: 16px;
              color: #000;
              display: block;
              line-height: 100%;
              font-weight: 700;
              /* margin-bottom: 10px; */
              font-family: "Manrope", sans-serif;
          }

          .product_title {
              font-size: 16px;
              font-weight: 400;
              margin: 0px;
              line-height: 100%;
              margin-bottom: 10px;
              font-family: "Manrope", sans-serif;
          }

          .title_and_country {
              display: flex;
              gap: 20px;
              align-items: center;
              justify-content: space-between;
              margin-top: 3px;
          }

          .title_and_country p {
              font-size: 14px;
              font-weight: 400;
              line-height: 100%;
              font-family: "Manrope", sans-serif;
              margin-top: 0px;
          }

          .product_price {
              font-size: 16px;
              font-weight: 400;
              line-height: 100%;
              font-family: "Manrope", sans-serif;
          }

          @media (min-width:1560px) {
              .product_vendor {
                  font-size: 33px;
              }

              .product_title {
                  font-size: 24px;
              }

              .title_and_country p {
                  font-size: 16px;
              }

              .product_price {
                  font-size: 26px;
              }

              .save_image {
                  width: 35px;
                  height: 35px;
              }

              .country_and_image_container_image {
                  width: 28px;
                  height: 28px;
              }

              .catalogue_country_and_image_container p {
                  font-size: 26px;
              }
          }

          @media (max-width: 1200px) {
              .product-card {
                  flex: 1 1 calc(25% - 20px);
                  max-width: calc(25% - 20px);
              }
          }

          @media (max-width: 900px) {
              .product-card {
                  flex: 1 1 calc(33.33% - 20px);
                  max-width: calc(33.33% - 20px);
              }
          }

          @media (max-width: 600px) {
              .product-card {
                  flex: 1 1 calc(50% - 20px);
                  max-width: calc(50% - 20px);
              }
          }

          @media (max-width: 400px) {
              .product-card {
                  flex: 1 1 100%;
                  max-width: 100%;
              }
          }

          .product-card-underline:hover {
              border-bottom: 2px solid black;
          }
      </style>
      <style>
          .login_new_to_nessh_back_arrow_container {
              margin-top: 20px;
          }

          .home_catalogue {
              display: flex;
              justify-content: space-between;
              padding: 0px 20px;
              margin-top: 36px;
              margin-bottom: 36px;
              align-items: center;
          }

          .full_catalogue {
              font-weight: 600;
              line-height: 100%;
              font-size: 24px;
              font-family: "Manrope", sans-serif;
          }

          .home_page_catalogue_collection_icons {
              display: flex;
              align-items: center;
          }

          .home_page_catalogue_icon_contaienr {
              padding: 20px;
          }

          .home_page_catalogue_icon_innercontaienr {
              width: 25px;
              height: 25px;
          }

          .home_page_catalogue_icon_innercontaienr img {
              width: 100%;
              height: 100%;
              object-fit: contain;
          }



          /* ---------- BASE (contained) ---------- */
          .uptitle-main-heading-container {
              display: flex;
              justify-content: space-between;
              align-items: center;
              gap: 12px;
              padding: 10px 16px;
              /* border: 1px solid #ddd; */
              /* visible border */
              border-radius: 6px;
              background: #fff;
              box-sizing: border-box;
              width: 100%;
              /* full width of parent */
              overflow: hidden;
              /* prevent child borders from leaking out */
          }

          /* left area should be flexible and able to shrink (fixes wrapping issues) */
          .uptitle-main-heading-container .left {
              flex: 1 1 auto;
              min-width: 0;
              /* allows text truncation if container is tight */
              text-decoration: none;
          }

          /* remove any accidental bottom-border coming from link/h1 styles */
          .login_new_to_nessh_back_arrow,
          .login_new_to_nessh_back_arrow h1 {
              border-bottom: none !important;
              text-decoration: none;
              color: inherit;
              display: block;
          }

          /* heading */
          .my_title {
              margin: 0;
              font-size: 22px;
              white-space: nowrap;
              /* keep it on one line on wider screens */
              overflow: hidden;
              text-overflow: ellipsis;
          }

          /* button on right */
          .upload-btn {
              flex: 0 0 auto;
              /* don't grow, don't shrink */
              display: inline-flex;
              align-items: center;
              justify-content: center;
              padding: 8px 18px;
              border-radius: 6px;
              background: #000;
              color: #fff;
              text-decoration: none;
              font-weight: 600;
              border: 1px solid rgba(255, 255, 255, 0.06);
              /* subtle inner edge */
              white-space: nowrap;
          }

          /* hide short version by default */
          .upload-btn .short {
              display: none;
          }

          /* ---------- MOBILE (responsive tweaks) ---------- */
          @media (max-width: 576px) {
              .my_title {
                  font-size: 18px;
                  white-space: normal;
                  /* allow wrapping on tiny screens */
              }

              .upload-btn {
                  font-size: 13px;
                  padding: 6px 10px;
              }

              /* show single word on mobile */
              .upload-btn .full {
                  display: none;
              }

              .upload-btn .short {
                  display: inline;
              }
          }

          .uptitle-main-heading-container.full-bleed {
              width: 100vw;
              position: relative;
              left: 50%;
              right: 50%;
              margin-left: -50vw;
              margin-right: -50vw;
              border-radius: 0;
          }

          .uptitle-main-heading-container+* {

              border-top: none !important;
          }
      </style>
  </head>

  <body>
     

@include('layouts.publisherheader')

      <div class="uptitle-main-heading-container_wrapper">
          <!-- Blade: use .full-bleed class only when you want edge-to-edge border -->
          <div class="uptitle-main-heading-container full-bleed">
              <!-- LEFT -->
              <a href="{{ route('dashboard') }}" class="left" style="color: #000;">
                  <h1 class="my_title">Welcome back, {{ Auth::user()->name }} </h1>
              </a>

              <!-- RIGHT -->
              <a href="{{ route('publisher.magazines.create') }}" class="upload-btn">
                  <span class="full">Upload Magazine</span>
                  <span class="short" aria-hidden="true">Upload</span>
              </a>
          </div>


      </div>
      <div class="home_catalogue">
          <div class="full_catalogue">
              Your Catalogue
          </div>
          <div class="home_page_catalogue_collection_icons">
              <button class="home_page_catalogue_icon_contaienr" id="viewToggleBtn" title="Toggle view" style="background: none; border: none; cursor: pointer; padding: 0;">
                  <div class="home_page_catalogue_icon_innercontaienr">
                      <img src="{{ asset('assets/image/Eye.png') }}" alt="View Toggle">
                  </div>
              </button>
              <button class="home_page_catalogue_icon_contaienr" id="searchBtn" title="Search" style="background: none; border: none; cursor: pointer; padding: 0;">
                  <div class="home_page_catalogue_icon_innercontaienr">
                      <img src="{{ asset('assets/image/Search.png') }}" alt="Search">
                  </div>
              </button>
              <button class="home_page_catalogue_icon_contaienr" id="sortBtn" title="Sort" style="background: none; border: none; cursor: pointer; padding: 0;">
                  <div class="home_page_catalogue_icon_innercontaienr">
                      <img src="{{ asset('assets/image/top-bottom-arrrow.png') }}" alt="Sort">
                  </div>
              </button>
              <button class="home_page_catalogue_icon_contaienr" id="filterBtn" title="Filter" style="background: none; border: none; cursor: pointer; padding: 0;">
                  <div class="home_page_catalogue_icon_innercontaienr">
                      <img src="{{ asset('assets/image/Left Right Filter.png') }}" alt="Filter">
                  </div>
              </button>
          </div>
      </div>

      <!-- Search Bar (hidden by default) -->
      <div id="searchBar" style="display: none; padding: 20px; background: #f9f9f9; border-bottom: 1px solid #eee;">
          <input type="text" id="searchInput" placeholder="Search magazines by title..." style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-family: 'Manrope', sans-serif;">
      </div>

      <!-- Sort Options (hidden by default) -->
      <div id="sortOptions" style="display: none; padding: 20px; background: #f9f9f9; border-bottom: 1px solid #eee;">
          <label style="display: block; margin-bottom: 10px;">
              <input type="radio" name="sort" value="newest" checked> Newest First
          </label>
          <label style="display: block; margin-bottom: 10px;">
              <input type="radio" name="sort" value="oldest"> Oldest First
          </label>
          <label style="display: block; margin-bottom: 10px;">
              <input type="radio" name="sort" value="title-asc"> Title (A-Z)
          </label>
          <label style="display: block; margin-bottom: 10px;">
              <input type="radio" name="sort" value="title-desc"> Title (Z-A)
          </label>
          <label style="display: block; margin-bottom: 10px;">
              <input type="radio" name="sort" value="price-asc"> Price (Low to High)
          </label>
          <label style="display: block;">
              <input type="radio" name="sort" value="price-desc"> Price (High to Low)
          </label>
      </div>

      <!-- Filter Options (hidden by default) -->
      <div id="filterOptions" style="display: none; padding: 20px; background: #f9f9f9; border-bottom: 1px solid #eee;">
          <div style="margin-bottom: 15px;">
              <label style="display: block; font-weight: 600; margin-bottom: 8px;">Genre</label>
              <select id="genreFilter" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px;">
                  <option value="">All Genres</option>
                  @php
                      $genres = $magazines->pluck('genre')->filter()->unique();
                  @endphp
                  @foreach($genres as $genre)
                      <option value="{{ $genre }}">{{ $genre }}</option>
                  @endforeach
              </select>
          </div>
          <div>
              <label style="display: block; font-weight: 600; margin-bottom: 8px;">Type</label>
              <label style="display: block; margin-bottom: 8px;">
                  <input type="checkbox" class="typeFilter" value="single"> Single Issue
              </label>
              <label style="display: block;">
                  <input type="checkbox" class="typeFilter" value="series"> Series
              </label>
          </div>
      </div>
      <div class="collection" style="padding: 20px;">
          @forelse($magazines as $magazine)
              <a href="{{ route('magazines.show', $magazine->id) }}" class="product-card product-card-underline" data-type="{{ $magazine->type }}" data-created="{{ $magazine->created_at }}">
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


  </body>

  </html>
