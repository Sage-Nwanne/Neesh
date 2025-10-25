<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Edit Title</title>
  <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}">
  <script src="{{ asset('assets/js/menu.js') }}"></script>
  <style>
      select.uptitle-input-text { color: black; }
      select.uptitle-input-text option[value=""] { color: #999; }
      select.uptitle-input-text:invalid { color: #999; }
      .publisher_and_retailer_conatiner { max-width: 900px; margin-inline: auto; margin-top: 30px; }
      .uptitle-upload-box { margin-top: 35px; }
      .formimagesshow { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px; }
      .formimagesshow .preview-image { width: 120px; height: 150px; object-fit: cover; border-radius: 8px; border: 1px solid #ccc; }
      #previewContainer { max-height: 180px; width: 100%; margin-bottom: 25px; }
      .uptitle-form-container { padding: 20px; }
  </style>
</head>

<body>

  @include('layouts.publisherheader')

  <div class="uptitle-main-heading-container_wrapper">
      <div class="uptitle-main-heading-container">
          <a href="{{ route('dashboard') }}" class="login_new_to_nessh_back_arrow">
              <div class="back_navigation_title">
                  <img src="{{ asset('assets/image/left arrow.png') }}" alt="Logo Image">
              </div>
              <h1 class="my_title">Edit Title</h1>
          </a>
      </div>
  </div>

  @if (session('success'))
      <div style="background:#e7f9ee; border-left:5px solid #27ae60; color:#155724; padding:14px 20px; margin-bottom:20px; border-radius:8px; font-family:'Inter',sans-serif; display:flex; justify-content:space-between; align-items:center; box-shadow:0 2px 6px rgba(0,0,0,0.08);">
          <div><strong>✅ Success:</strong> {{ session('success') }}</div>
          <button onclick="this.parentElement.remove()" style="background:none;border:none;color:#155724;font-size:18px;cursor:pointer;">&times;</button>
      </div>
  @endif

  <form method="POST" action="{{ route('publisher.magazines.update', $magazine->id) }}" enctype="multipart/form-data">
      @csrf
      @method('POST')

      <div class="uptitle-form-container">
          <div class="uptitle-left-col">
              <div class="uptitle-section-title">Magazine Details</div>

              <div class="sereis_and_single_issue_container">
                  <label><input type="radio" name="type" value="single" {{ $magazine->type == 'single' ? 'checked' : '' }}> Single Issue</label>
                  <label><input type="radio" name="type" value="series" {{ $magazine->type == 'series' ? 'checked' : '' }}> Series</label>
              </div>

              <input type="text" class="uptitle-input-text" name="title" value="{{ old('title', $magazine->title_name) }}" placeholder="Full Magazine Title" required>

              <div id="series_fields" style="{{ $magazine->type == 'series' ? '' : 'display:none;' }}">
                  <input type="text" class="uptitle-input-text" name="issue_number" value="{{ old('issue_number', $magazine->issue_identifier) }}" placeholder="Issue Number or Seasonal ID">
                  <select class="uptitle-input-text" id="frequency" name="issue_frequency">
                      <option value="" disabled {{ !$magazine->issue_frequency ? 'selected' : '' }}>Publication Frequency</option>
                      <option value="monthly" {{ $magazine->issue_frequency == 'monthly' ? 'selected' : '' }}>Monthly</option>
                      <option value="quarterly" {{ $magazine->issue_frequency == 'quarterly' ? 'selected' : '' }}>Quarterly</option>
                      <option value="bi-annual" {{ $magazine->issue_frequency == 'bi-annual' ? 'selected' : '' }}>Bi-annual</option>
                      <option value="annual" {{ $magazine->issue_frequency == 'annual' ? 'selected' : '' }}>Annual</option>
                      <option value="irregular" {{ $magazine->issue_frequency == 'irregular' ? 'selected' : '' }}>Irregular</option>
                  </select>
              </div>

              <script>
                  document.querySelectorAll('input[name="type"]').forEach((radio) => {
                      radio.addEventListener('change', function() {
                          const seriesFields = document.getElementById('series_fields');
                          seriesFields.style.display = this.value === 'series' ? 'block' : 'none';
                      });
                  });
              </script>

              <input type="text" class="uptitle-input-text" name="genre" value="{{ old('genre', $magazine->genre) }}" placeholder="Genre(s)">
              <input type="text" class="uptitle-input-text" name="dimensions" value="{{ old('dimensions', $magazine->dimensions) }}" placeholder="Dimensions (width x height, weight)">
              <input type="number" class="uptitle-input-text" name="page_count" value="{{ old('page_count', $magazine->page_count) }}" placeholder="Page Count">

              <div class="uptitle-section-title">Inventory & Logistics</div>
              <input type="number" class="uptitle-input-text" name="print_run" value="{{ old('print_run', $magazine->total_printed) }}" placeholder="Print Run" required>
              <input type="text" class="uptitle-input-text" name="warehouse" value="{{ old('warehouse', $magazine->warehouse) }}" placeholder="e.g ,123 NEESH St, New York, NY 10001" required>
              <input type="number" class="uptitle-input-text" name="stock" value="{{ old('stock', $magazine->stock) }}" placeholder="Available Quantities" required>
            <input type="text" class="uptitle-input-text" name="restock_timeline" value="{{ old('restock_timeline', $magazine->restock_timeline) }}" placeholder="Restock Timeline (e.g , 3 months, 6 weeks)" required>

          </div>

          <div class="uptitle-right-col">
              <div class="uptitle-section-title">Assets</div>
              <label for="coverUpload" class="uptitle-upload-box">
                  <h2>Upload New Images</h2>
                  <p>(Existing images shown below)</p>
                  <input id="coverUpload" type="file" name="files[]" multiple accept="image/*" style="display:none;">
              </label>

              <!-- show existing images -->
              <div class="formimagesshow">
                  @foreach($magazine->images as $image)
                      <img src="{{ asset('storage/' . $image->image_path) }}" class="preview-image" alt="">
                  @endforeach
              </div>

              <div id="previewContainer" class="formimagesshow"></div>

              <input type="text" class="uptitle-input-text" name="promotional_text" value="{{ old('promotional_text', $magazine->promotional_text) }}" placeholder="Promotional Text">
              <input type="text" class="uptitle-input-text" name="metadata" value="{{ old('metadata', $magazine->metadata) }}" placeholder="Metadata (ISBN, ISSN, keywords)">

              <div class="uptitle-section-title">Commercial Terms</div>
              <input type="number" step="0.01" class="uptitle-input-text" name="wholesale_price" value="{{ old('wholesale_price', $magazine->wholesale_price) }}" placeholder="Wholesale Price (WSP)" required>
              <input type="number" step="0.01" class="uptitle-input-text" name="retail_price" value="{{ old('retail_price', $magazine->msrp) }}" placeholder="Retail Price (MSRP)" required>
              <input type="text" class="uptitle-input-text" name="discount" value="{{ old('discount', $magazine->discount) }}" placeholder="Discount Structure">
              <input type="text" class="uptitle-input-text" name="payment_terms" value="{{ old('payment_terms', $magazine->payment_terms) }}" placeholder="Payment Terms & Schedule">

              <div style="display:flex;justify-content:end;margin-top:30px;margin-bottom:30px;">
                  <button class="uptitle-submit-btn" style="background-color:black;padding:12px 24px;color:white;font-size:16px;font-weight:600;border-radius:8px;border:none;cursor:pointer;">Update Title</button>
              </div>
          </div>
      </div>
  </form>

  <script>
      document.getElementById('coverUpload').addEventListener('change', function(event) {
          const previewContainer = document.getElementById('previewContainer');
          previewContainer.innerHTML = "";
          Array.from(event.target.files).forEach(file => {
              if (file.type.startsWith('image/')) {
                  const reader = new FileReader();
                  reader.onload = function(e) {
                      const img = document.createElement('img');
                      img.src = e.target.result;
                      img.classList.add('preview-image');
                      previewContainer.appendChild(img);
                  };
                  reader.readAsDataURL(file);
              }
          });
      });
  </script>

</body>
</html>
