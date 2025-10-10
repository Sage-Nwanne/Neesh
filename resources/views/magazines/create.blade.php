  <!DOCTYPE html>
  <html lang="en">

  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Upload a Title Form</title>
      <link rel="stylesheet" href="{{asset('assets/css/style.css')}}">
      <script src="{{asset('assets/js/menu.js')}}"></script>
      <style>
          select.uptitle-input-text {
              color: black;
          }

          select.uptitle-input-text option[value=""] {
              color: #999;
          }

          select.uptitle-input-text:invalid {
              color: #999;
          }

          .publisher_and_retailer_conatiner {
              max-width: 900px;
              margin-inline: auto;
              margin-top: 30px;
          }
          .uptitle-upload-box{
            margin-top: 35px;
          }
      </style>
      <style>
          .formimagesshow {
              display: flex;
              flex-wrap: wrap;
              /* agar jyada images ho to next line mai chale jaen */
              gap: 10px;
              margin-top: 15px;
          }

          .formimagesshow .preview-image {
              width: 120px;
              height: 150px;
              object-fit: cover;
              border-radius: 8px;
              border: 1px solid #ccc;
          }

          #previewContainer {

              max-height: 180px;
              width: 100%;
              margin-bottom: 25px;
          }
          .uptitle-form-container{
            padding: 20px;
          }
      </style>


  </head>

  <body>
      <div class="upload_topmenu_wrapper">
          <div class="upload_topmenu">
              <div class="logo-image">
                  <img src="{{asset('assets/image/Logo A1.png')}}" alt="Logo Image">
              </div>
              <div class="menu-container" id="menuToggle">
                  <img src="{{asset('assets/svg/hamburger-menu.svg')}}" alt="menu" style="width:35px;cursor:pointer;">

              </div>
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



      <div class="uptitle-main-heading-container_wrapper">
          <div class="uptitle-main-heading-container">
              <a href="{{route('dashboard')}}" class="login_new_to_nessh_back_arrow"> <!--uptitle-main-back-link class replace -->
                  <div class="back_navigation_title"> <!--uptitle-main-heading-img class replace -->
                      <img src="{{asset('assets/image/left arrow.png')}}" alt="Logo Image">

                  </div>
                  <h1 class="my_title">Upload a Title</h1> <!--uptitle-main-heading class replace -->
              </a>
          </div>
      </div>
      @if (session('success'))
      <div style="
        background: #e7f9ee;
         border-left: 5px solid #27ae60;
        color: #155724;
        padding: 14px 20px;
        margin-bottom: 20px;
       border-radius: 8px;
       font-family: 'Inter', sans-serif;
      display: flex;
       justify-content: space-between;
       align-items: center;
       box-shadow: 0 2px 6px rgba(0,0,0,0.08);
       ">
          <div>
              <strong style="font-weight:600;">✅ Success:</strong> {{ session('success') }}
          </div>
          <button onclick="this.parentElement.remove()" style="
        background: none;
        border: none;
        color: #155724;
        font-size: 18px;
        cursor: pointer;
        line-height: 1;
        ">&times;</button>
      </div>
      @endif

      @if (session('error'))
      <div style="
    background: #fdecea;
    border-left: 5px solid #e74c3c;
    color: #721c24;
    padding: 14px 20px;
    margin-bottom: 20px;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 6px rgba(0,0,0,0.08);
   ">
          <div>
              <strong style="font-weight:600;">⚠️ Error:</strong> {{ session('error') }}
          </div>
          <button onclick="this.parentElement.remove()" style="
        background: none;
        border: none;
        color: #721c24;
        font-size: 18px;
        cursor: pointer;
        line-height: 1;
       ">&times;</button>
      </div>
      @endif

      <form method="POST" action="{{ route('magazines.store') }}" enctype="multipart/form-data">
          @csrf
          <div class="uptitle-form-container">
              <div class="uptitle-left-col">
                  <div class="uptitle-section-title">Magazine Details</div>
                  <div class="sereis_and_single_issue_container">
                      <label><input type="radio" name="type" value="single" required> Single Issue</label>
                      <label><input type="radio" name="type" value="series"> Series</label>
                  </div>

                  <input type="text" class="uptitle-input-text" name="title" placeholder="Full Magazine Title" required>

                  <!-- Ye 2 fields initially hidden -->
                  <div id="series_fields" style="display:none;">
                      <input type="text" class="uptitle-input-text" name="issue_number" placeholder="Issue Number or Seasonal ID">
                      <select class="uptitle-input-text" id="frequency" name="issue_frequency">
                          <option value="" disabled selected hidden>Publication Frequency</option>
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="bi-annual">Bi-annual</option>
                          <option value="annual">Annual</option>
                          <option value="irregular">Irregular</option>
                      </select>
                  </div>

                  <script>
                      document.querySelectorAll('input[name="type"]').forEach((radio) => {
                          radio.addEventListener('change', function() {
                              const seriesFields = document.getElementById('series_fields');
                              if (this.value === 'series') {
                                  seriesFields.style.display = 'block';
                              } else {
                                  seriesFields.style.display = 'none';
                              }
                          });
                      });
                  </script>





                  <input type="text" class="uptitle-input-text" name="genre" placeholder="Genre(s)">
                  <input type="text" class="uptitle-input-text" name="dimensions" placeholder="Dimensions (width x height, weight)">
                  <input type="number" class="uptitle-input-text" name="page_count" placeholder="Page Count">

                  <div class="uptitle-section-title">Inventory & Logistics</div>
                  <input type="number" class="uptitle-input-text" name="print_run" placeholder="Print Run" required>
                  <input type="text" class="uptitle-input-text" name="warehouse" placeholder="e.g ,123 NEESH St, New York, NY 10001" required>
                  <input type="number" class="uptitle-input-text" name="stock" placeholder="Available Quantities" required>
                  <input type="text" class="uptitle-input-text" name="restock_time" placeholder="e.g , 3 months, 6 weeks">
              </div>

              <div class="uptitle-right-col">
                  <div class="uptitle-section-title">Assets</div>
                  <label for="coverUpload" class="uptitle-upload-box">
                      <h2>Upload Images</h2>
                      <p>High Resolution Images (300DPI)</p>
                      <input id="coverUpload" type="file" name="files[]" multiple accept="image/*" style="display:none;">
                  </label>
                  <div id="previewContainer" class="formimagesshow"></div>

                  <input type="text" class="uptitle-input-text" name="promotional_text" placeholder="Promotional Text">
                  <input type="text" class="uptitle-input-text" name="metadata" placeholder="Metadata (ISBN, ISSN, keywords)">

                  <div class="uptitle-section-title">Commercial Terms</div>
                  <input type="number" step="0.01" class="uptitle-input-text" name="wholesale_price" placeholder="Wholesale Price (WSP)" required>
                  <input type="number" step="0.01" class="uptitle-input-text" name="retail_price" placeholder="Retail Price (MSRP)" required>
                  <input type="text" class="uptitle-input-text" name="discount" placeholder="Discount Structure">
                  <input type="text" class="uptitle-input-text" name="payment_terms" placeholder="Payment Terms & Schedule">

                  <div style="display: flex; justify-content: end; margin-top: 30px; margin-bottom: 30px;">
                      <button class="uptitle-submit-btn"
                          style="background-color: black; 
               padding: 12px 24px; 
               color: white; 
               font-size: 16px; 
               font-weight: 600; 
               border-radius: 8px; 
               border: none; 
               cursor: pointer;
               transition: background-color 0.3s ease;">
                          Submit Title
                      </button>
                  </div>
              </div>
          </div>
      </form>


  </body>
  <script>
      document.getElementById('coverUpload').addEventListener('change', function(event) {
          const previewContainer = document.getElementById('previewContainer');
          previewContainer.innerHTML = ""; // clear old previews

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


  </html>