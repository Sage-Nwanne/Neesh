<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>register</title>
    <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

    <link rel="stylesheet" href="{{ asset('assets/css/publisherregister.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/js/publisherregisterform.js') }}">

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
            height: 120px;
            object-fit: cover;
            border-radius: 8px;
            border: 1px solid #ccc;
        }
    </style>
</head>

<body>
    <div class="logo-image">
        <a href="{{ route('home') }}" style="text-decoration: none;">
            <img src="{{ asset('assets/image/Logo A1.png') }}" alt="Logo Image" style="cursor: pointer;">
        </a>
    </div>

    <div class="new_to_nessh_innerwhole_container">
        <a href="{{ route('home') }}" class="new_to_nessh_back_arrow">
            <img src="{{ asset('assets/image/left arrow.png') }}" alt="Back Arrow">
        </a>
        <div class="new_to_nessh_container">
            <div class="heading_and_description_container">
                <h1 class="new_to_nessh_heading">Join Neesh as a Publisher</h1>
                <p class="new_to_nessh_description">Apply to join our curated network</p>
            </div>
            @if (session('success'))
                <div
                    style="
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
                    <button onclick="this.parentElement.remove()"
                        style="
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
                <div
                    style="
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
                    <button onclick="this.parentElement.remove()"
                        style="
        background: none;
        border: none;
        color: #721c24;
        font-size: 18px;
        cursor: pointer;
        line-height: 1;
       ">&times;</button>
                </div>
            @endif


            <div class="publisher_and_retailer_conatiner">
                <div class="publisher_form_wrapper">
                    <div class="step-header">
                        <small id="stepIndicator">Step 1 of 1</small>
                        <span class="progress" id="progressText">0% Complete</span>
                    </div>

                    <form method="POST" id="multiStepForm" action="{{ route('register') }}"
                        enctype="multipart/form-data">
                        @csrf

                        <!-- Step 1 -->
                        <div class="form-step active">
                            <div class="uptitle-section-title">Publisher Information</div>

                            <div class="publisher_form_input_display">
                                <input type="text" value="publisher" name="role" hidden>
                                <div class="input_block">
                                    <label class="email_label" for="firstname">First Name</label>
                                    <div class="publisher_formfields">
                                        <input class="uptitle-input-text" id="firstname" name="firstname" type="text"
                                            placeholder="First Name" required>
                                    </div>
                                </div>

                                <div class="input_block">
                                    <label class="email_label" for="lastname">Last Name</label>
                                    <div class="publisher_formfields">
                                        <input class="uptitle-input-text" id="lastname" name="lastname" type="text"
                                            placeholder="Last Name" required>
                                    </div>
                                </div>

                                <div class="input_block">
                                    <label class="email_label" for="bussinessname">Business / Publisher Name</label>
                                    <div class="publisher_formfields">
                                        <input class="uptitle-input-text" id="bussinessname" name="bussinessname"
                                            type="text" placeholder="Business Name" required>
                                    </div>
                                </div>

                                <div class="input_block">
                                    <label class="email_label" for="publisheremail">Email</label>
                                    <div class="publisher_formfields">
                                        <input class="uptitle-input-text" id="publisheremail" name="email"
                                            type="email" placeholder="Email" required>
                                    </div>
                                </div>

                                <div class="input_block">
                                    <label class="password_label" for="publisherpassword">Password</label>
                                    <div class="publisher_formfields">
                                        <div class="publisher_formfields_innerwrapper">
                                            <input class="uptitle-input-text" id="publisherpassword" name="password"
                                                type="password" placeholder="Password" minlength="6" required>
                                            <i class="fa-solid fa-eye publisher-eye-toggle"
                                                data-target="publisherpassword"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Step 2 -->
                        <div class="form-step">
                            <div class="uptitle-section-title">Magazine Details</div>
                            <div class="publisher_form_input_display">

                                <div class="publisher_formfields">
                                    <label for="magazine_title">Full Magazine Title</label>
                                    <input type="text" id="magazine_title" class="uptitle-input-text"
                                        name="magazine_title" placeholder="Full Magazine Title" required>
                                </div>

                                <div class="publisher_formfields">
                                    <label for="website_link">Website / Social Link</label>
                                    <input type="text" id="website_link" class="uptitle-input-text"
                                        name="website_link" placeholder="Website / Social Link">
                                </div>

                                <div class="publisher_formfields">
                                    <label for="magazinedescription">Description</label>
                                    <textarea name="magazinedescription" id="magazinedescription" placeholder="Description" required></textarea>
                                </div>
                            </div>
                            <div class="publisher_formfields">
                                <label for="genre">Genre(s)</label>
                                <input type="text" class="uptitle-input-text" name="genre"
                                    placeholder="Genre(s)">
                            </div>
                            <div class="publisher_formfields">
                                <label for="dimensions">Dimensions</label>
                                <input type="text" class="uptitle-input-text" name="dimensions"
                                    placeholder="Dimensions (width x height)">
                            </div>
                            <div class="publisher_formfields">
                                <label for="magazinedescription">Page Count</label>
                                <input type="number" class="uptitle-input-text" name="page_count"
                                    placeholder="Page Count">
                            </div>



                            <div style="margin-top:14px;">
                                <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
                                    <div class="uploadform_single_and_series_issue_checkbox">
                                        <input type="radio" name="issue_type" value="single" id="single_issue"
                                            required>
                                        <label for="single_issue">Single Issue</label>
                                    </div>
                                    <div class="uploadform_single_and_series_issue_checkbox">
                                        <input type="radio" name="issue_type" value="series" id="series">
                                        <label for="series">Series</label>
                                    </div>
                                </div>

                                <div class="publisher_form_input_display series_fields" id="series_fields"
                                    aria-hidden="true">
                                    <div class="publisher_formfields">
                                        <label for="series_issue_count">Issue Number</label>
                                        <input type="number" id="series_issue_count" class="uptitle-input-text"
                                            name="series_issue_count" placeholder="Issue Number or Seasonal ID">
                                    </div>

                                    <div class="publisher_formfields">
                                        <label for="issue_frequency">Issue Frequency</label>
                                        <select class="uptitle-input-text" id="issue_frequency"
                                            name="issue_frequency">
                                            <option value="" disabled selected hidden>Issue Frequency</option>
                                            <option value="monthly">Monthly</option>
                                            <option value="quarterly">Quarterly</option>
                                            <option value="bi-annual">Bi-annual</option>
                                            <option value="annual">Annual</option>
                                            <option value="irregular">Irregular</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Step 3 -->
                        <div class="form-step">
                            <div class="uptitle-section-title">Print Run & Pricing</div>
                            <div class="publisher_form_input_display">

                                <div class="publisher_formfields">
                                    <label for="print_run">Print Run</label>
                                    <input type="number" id="print_run" class="uptitle-input-text" name="print_run"
                                        placeholder="Print Run" required>
                                </div>

                                <div class="publisher_formfields">
                                    <label for="available_quantities">Available Quantities</label>
                                    <input type="number" id="available_quantities" class="uptitle-input-text"
                                        name="available_quantities" placeholder="Available Quantities" required>
                                </div>

                                <div class="publisher_formfields">
                                    <label for="wholesale_price">Wholesale Price (WSP)</label>
                                    <input type="number" id="wholesale_price" class="uptitle-input-text"
                                        name="wholesale_price" placeholder="Wholesale Price (WSP)" step="0.01" required>
                                </div>

                                <div class="publisher_formfields">
                                    <label for="retail_price">Suggested Retail Price</label>
                                    <input type="number" id="retail_price" class="uptitle-input-text"
                                        name="retail_price" placeholder="Suggested Retail Price" step="0.01" required>
                                </div>

                                <div class="publisher_formfields">
                                    <label for="specs">Additional Specs</label>
                                    <textarea id="specs" name="specs" placeholder="Additional Specs" required></textarea>
                                </div>
                            </div>
                        </div>
                        <div class="form-step">
                            <div class="uptitle-section-title">Assets</div>
                            <div style="background: #f0f8ff; border-left: 4px solid #2196F3; padding: 12px; margin-bottom: 16px; border-radius: 4px;">
                                <p style="margin: 0; font-size: 14px; color: #333; line-height: 1.6;">
                                    <strong>Image Requirements:</strong><br>
                                    • Minimum file size: 100 KB<br>
                                    • Maximum file size: 5 MB<br>
                                    • Recommended: High Resolution Images (300 DPI)<br>
                                    • Maximum 6 images per upload
                                </p>
                            </div>
                            <label for="coverUploadimage" class="uptitle-upload-box">
                                <h2>Upload Images</h2>
                                <p>High Resolution Images (300DPI)</p>
                                <input class="upload" id="coverUploadimage" type="file" name="files[]" multiple
                                    accept="image/*" style="display:none;">

                            </label>
                            <div id="previewContainer" class="formimagesshow"></div>
                            <div class="limit_telling">You can only upload 6 images.</div>
                        </div>
                        <!-- Step 4 -->
                        <div class="form-step">
                            <div class="uptitle-section-title">Fulfillment & Logistics</div>
                            <div class="publisher_form_input_display" style="display:flex; flex-wrap:wrap; gap:12px;">

                                <div class="publisher_formfields">
                                    <label for="fulfillment_method">Fulfillment Method</label>
                                    <select id="fulfillment_method" class="uptitle-input-text"
                                        name="fulfillment_method" required>
                                        <option value="" disabled selected hidden>Select Fulfillment Method
                                        </option>
                                        <option value="self-fulfillment">Self Fulfillment</option>
                                        <option value="thirdparty-fulfillment">Third Party Logistics</option>
                                        <option value="neesh-fulfillment">Neesh Fulfillment</option>
                                    </select>
                                </div>
                                <div class="publisher_formfields">
                                    <label for="warehouse">Shipping Address</label>
                                    <input type="text" class="uptitle-input-text" name="warehouse"
                                        placeholder="Shipping Address" required>
                                </div>
                                <div class="publisher_formfields">
                                    <label for="shipping_city">Shipping City</label>
                                    <input type="text" id="shipping_city" class="uptitle-input-text"
                                        name="shipping_city" placeholder="Shipping City" required>
                                </div>

                                <div class="publisher_formfields">
                                    <label for="shipping_state">Shipping State</label>
                                    <input type="text" id="shipping_state" class="uptitle-input-text"
                                        name="shipping_state" placeholder="Shipping State" required>
                                </div>

                                <div class="publisher_formfields">
                                    <label for="shipping_country">Shipping Country</label>
                                    <input type="text" id="shipping_country" class="uptitle-input-text"
                                        name="shipping_country" placeholder="Shipping Country" required>
                                </div>

                                <div class="publisher_formfields" style="flex:1 1 100%;">
                                    <label for="return_policy">Return Policy</label>
                                    <textarea class="uptitle-input-text" id="return_policy" name="return_policy" placeholder="Return Policy"
                                        rows="3" required></textarea>
                                </div>
                            </div>
                        </div>

                        <!-- Step 5 -->
                        <div class="form-step">
                            <div class="uptitle-section-title">Sales Experience</div>
                            <label class="password_label" for="salesexperience">Have you sold this issue
                                before?</label>

                            <div class="publisher_form_input_display">
                                <div style="position: relative;top:12px;display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
                                    <div class="uploadform_single_and_series_issue_checkbox">
                                        <input type="radio" name="sales_experience" value="yes" id="sales_yes"
                                            required>
                                        <label for="sales_yes">Yes</label>
                                    </div>
                                    <div class="uploadform_single_and_series_issue_checkbox">
                                        <input type="radio" name="sales_experience" value="no" id="sales_no">
                                        <label for="sales_no">No</label>
                                    </div>
                                </div>

                                <div id="sales_experience_fields" style="display:none; margin-top:15px;">
                                    <div>
                                        <label class="email_label">Distribution Channels *</label>
                                        <div style="display:flex; flex-wrap:wrap; gap:12px; margin-top:8px;">
                                            <div><input type="checkbox" name="distribution_channels[]" value="online"
                                                    id="channel_online"><label for="channel_online">Online
                                                    Directory</label></div>
                                            <div><input type="checkbox" name="distribution_channels[]"
                                                    value="bookstores" id="channel_bookstores"><label
                                                    for="channel_bookstores">Local Bookstores</label></div>
                                            <div><input type="checkbox" name="distribution_channels[]"
                                                    value="news_stands" id="channel_news"><label
                                                    for="channel_news">News Stands</label></div>
                                            <div><input type="checkbox" name="distribution_channels[]"
                                                    value="subscription" id="channel_subscription"><label
                                                    for="channel_subscription">Subscription</label></div>
                                            <div><input type="checkbox" name="distribution_channels[]" value="events"
                                                    id="channel_events"><label for="channel_events">Events /
                                                    Markets</label></div>
                                            <div><input type="checkbox" name="distribution_channels[]" value="other"
                                                    id="channel_other"><label for="channel_other">Other</label></div>
                                        </div>
                                    </div>

                                    <div class="publisher_formfields" style="margin-top:15px;">
                                        <label for="copies_sold">Estimated Copies Sold</label>
                                        <input type="number" id="copies_sold" class="uptitle-input-text"
                                            name="copies_sold" placeholder="Estimated Copies Sold">
                                    </div>

                                    <div class="publisher_formfields" style="margin-top:15px;">
                                        <label for="sales_feedback">Share relevant press links or reviews of your publication.</label>
                                        <textarea class="uptitle-input-text" id="sales_feedback" name="sales_feedback"
                                            placeholder="Share your feedback..." rows="3"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Step 6 -->
                        <div class="form-step" id="review_step">
                            <div class="uptitle-section-title">Review & Submit</div>
                            <div id="summaryList"></div>
                            <div style="margin-top:10px; display:flex; gap:8px; justify-content:flex-end;">
                                <button type="button" class="btn btn-back" id="editAllBtn">Edit</button>
                                <button type="submit" class="btn btn-next" id="finalSubmitBtn">Submit</button>
                            </div>
                        </div>
                        <div class="form-nav">
                            <button type="button" class="btn btn-back" id="prevBtn">Back</button>
                            <button type="button" class="btn btn-next" id="nextBtn">Continue</button>
                            {{-- <button type="button" class="next-step-btn" id="termsNextBtn" disabled>I Agree & Continue →</button> --}}

                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script src="{{ asset('assets/js/publisherregisterform.js') }}"></script>
    <script>
        document.getElementById('coverUploadimage').addEventListener('change', function(event) {
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
    <script>
        document.querySelectorAll('input[name="sales_experience"]').forEach((el) => {
            el.addEventListener('change', function() {
                const extraFields = document.getElementById('sales_experience_fields');
                extraFields.style.display = this.value === 'yes' ? 'block' : 'none';
            });
        });
    </script>
    
</body>

</html>
