<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Retailer Registration - NEESH</title>
    <meta name="description" content="Register as a retailer on NEESH - The OS for Indie Print. Discover and sell independent magazines.">
    <meta name="keywords" content="retailer registration, indie print, magazine marketplace">
    <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link rel="stylesheet" href="{{ asset('assets/css/publisherregister.css') }}">

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
    <style>
        /* minimal layout helpers — adjust to match your theme */
        .store-profile-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
        }

        .checkbox-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .publisher_formfields label.group-label {
            font-weight: 600;
            display: block;
            margin-bottom: 8px;
        }

        .checkbox-label {
            display: inline-flex;
            gap: 8px;
            align-items: center;
            cursor: pointer;
        }

        .field-error {
            color: #c00;
            margin-top: 8px;
            font-size: .95rem;
        }

        @media (max-width: 900px) {
            .store-profile-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>

<body>
    <div class="logo-image">
        <a href="https://neesh.art/" style="text-decoration: none;">
            <img src="{{asset('assets/image/Logo A1.png')}}" alt="Logo Image" style="cursor: pointer;">
        </a>
    </div>

    <div class="new_to_nessh_innerwhole_container">
        <a href="{{route('home')}}" class="new_to_nessh_back_arrow">
            <img src="{{asset('assets/image/left arrow.png')}}" alt="Back Arrow">
        </a>
        <div class="new_to_nessh_container">
            <div class="heading_and_description_container">
                <h1 class="new_to_nessh_heading">Join Neesh as a Retailer</h1>
                <p class="new_to_nessh_description">Apply to join our curated network</p>
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


            <div class="publisher_and_retailer_conatiner">
                <div class="publisher_form_wrapper">
                    <div class="step-header">
                        <small id="stepIndicator">Step 1 of 1</small>
                        <span class="progress" id="progressText">0% Complete</span>
                    </div>

                    <form method="POST" id="multiStepForm" action="{{ route('register.submit.retailer') }}" enctype="multipart/form-data">
                        @csrf

                        <!-- Step 1 -->
                        <div class="form-step active">
                            <div class="uptitle-section-title">Retailer Information</div>
                            <div class="publisher_form_input_display">

                                <div class="publisher_formfields">
                                    <label for="buyer_name">Buyer Name</label>
                                    <input type="text" id="buyer_name" class="uptitle-input-text" name="buyer_name" placeholder="Enter buyer's full name" required>
                                </div>

                                <div class="publisher_formfields">
                                    <label for="email_address">Email Address</label>
                                    <input type="email" id="email_address" class="uptitle-input-text" name="email_address" placeholder="Enter email address" required>
                                </div>

                                <div class="publisher_formfields">
                                    <label for="phone_number">Phone Number</label>
                                    <input type="tel" id="phone_number" class="uptitle-input-text" name="phone_number" placeholder="e.g. +1 234 567 8900" required>
                                </div>

                                <div class="publisher_formfields">
                                    <label for="password">Password</label>
                                    <input type="password" id="password" class="uptitle-input-text" name="password" placeholder="Enter password" minlength="6" required>
                                </div>

                            </div>
                        </div>
                        <!-- Step 2 -->
                        <div class="form-step ">
                            <div class="uptitle-section-title">Retailer Store Information</div>

                            <div class="publisher_form_input_display">
                                <input type="text" value="retailer" name="role" hidden>
                                <div class="input_block">
                                    <label class="email_label" for="storename">Shop Name</label>
                                    <div class="publisher_formfields">
                                        <input class="uptitle-input-text" id="storename" name="storename" type="text" placeholder="Your Store Name" required>
                                    </div>
                                </div>

                                <div class="input_block">
                                    <label class="email_label" for="bussinesyears">Years In Bussiness</label>
                                    <div class="publisher_formfields">
                                        <input class="uptitle-input-text" id="bussinesyears" name="bussinesyears" type="number" placeholder="e.g , 3" required>
                                    </div>
                                </div>

                                <div class="publisher_formfields">
                                    <label for="storecategory">Store Category</label>
                                    <select class="uptitle-input-text" id="storecategory" name="storecategory" required>
                                        <option value="" disabled selected hidden>Select Category</option>
                                        <option value="independent_bookstore">Independent Bookstore</option>
                                        <option value="coffee_shop_cafe">Coffee Shop/Cafe</option>
                                        <option value="boutique_fashion">Boutique/Fashion</option>
                                        <option value="gift_shop">Gift Shop</option>
                                        <option value="art_gallery">Art Gallery</option>
                                        <option value="museum_shop">Museum Shop</option>
                                        <option value="hotel_lobby_shop">Hotel/Lobby Shop</option>
                                        <option value="university_bookstore">University Bookstore</option>
                                        <option value="lifestyle_store">Lifestyle Store</option>
                                        <option value="other">Other</option>
                                    </select>

                                </div>

                                <div class="publisher_formfields">
                                    <label for="store_type">Store Type</label>
                                    <select class="uptitle-input-text" id="store_type" name="store_type" required>
                                        <option value="" disabled selected hidden>Select Type</option>
                                        <option value="independent">Independent</option>
                                        <option value="small_chain">Small Chain (2–5 locations)</option>
                                        <option value="regional_chain">Regional Chain (6–20 locations)</option>
                                        <option value="national_chain">National Chain (20+ locations)</option>
                                    </select>
                                </div>
                                <div class="publisher_formfields">
                                    <label for="store_size">Store Size</label>
                                    <select class="uptitle-input-text" id="store_size" name="store_size" required>
                                        <option value="" disabled selected hidden>Select Store Size</option>
                                        <option value="small">Small (under 1,000 sq. ft.)</option>
                                        <option value="medium">Medium (1,000–3,000 sq. ft.)</option>
                                        <option value="large">Large (over 3,000 sq. ft.)</option>
                                    </select>
                                </div>


                            </div>
                        </div>

                        <!-- Step 3 -->
                        <div class="form-step">
                            <div class="uptitle-section-title">Business Address</div>
                            <div class="publisher_form_input_display">

                                <div class="publisher_formfields">
                                    <label for="address_line1">Address Line 1</label>
                                    <input type="text" id="address_line1" class="uptitle-input-text" name="address_line1" placeholder="e.g. 123 Main Street" required>
                                </div>

                                <div class="publisher_formfields">
                                    <label for="address_line2">Address Line 2</label>
                                    <input type="text" id="address_line2" class="uptitle-input-text" name="address_line2" placeholder="Apartment, suite, unit, etc. (optional)">
                                </div>

                                <div class="publisher_formfields">
                                    <label for="city">City</label>
                                    <input type="text" id="city" class="uptitle-input-text" name="city" placeholder="e.g. New York" required>
                                </div>

                                <div class="publisher_formfields">
                                    <label for="state">State</label>
                                    <input type="text" id="state" class="uptitle-input-text" name="state" placeholder="e.g. NY" required>
                                </div>

                                <div class="publisher_formfields">
                                    <label for="zip_code">Zip Code</label>
                                    <input type="text" id="zip_code" class="uptitle-input-text" name="zip_code" placeholder="e.g. 10001" required>
                                </div>

                            </div>
                        </div>


                        <!-- Step 4 -->

                        <div class="form-step store-profile">
                            <div class="uptitle-section-title">Store Profile</div>

                            <div class="publisher_form_input_display store-profile-grid">

                                <!-- Target Customers -->
                                <div class="publisher_formfields" data-group="target_customers">
                                    <label class="group-label">Target Customers <span aria-hidden="true">*</span></label>
                                    <div class="checkbox-group">
                                        <label class="checkbox-label"><input type="checkbox" id="target_young_adults" name="target_customers[]" value="young_adults"> Young Adults (18-30)</label>
                                        <label class="checkbox-label"><input type="checkbox" id="target_millennials" name="target_customers[]" value="millennials"> Millennials (30-40)</label>
                                        <label class="checkbox-label"><input type="checkbox" id="target_genx" name="target_customers[]" value="gen_x"> Gen X (40-55)</label>
                                        <label class="checkbox-label"><input type="checkbox" id="target_baby_boomers" name="target_customers[]" value="baby_boomers"> Baby Boomers (55+)</label>
                                        <label class="checkbox-label"><input type="checkbox" id="target_families" name="target_customers[]" value="families_with_children"> Families with Children</label>
                                        <label class="checkbox-label"><input type="checkbox" id="target_students" name="target_customers[]" value="students"> Students</label>
                                        <label class="checkbox-label"><input type="checkbox" id="target_tourists" name="target_customers[]" value="tourists_visitors"> Tourists/Visitors</label>
                                        <label class="checkbox-label"><input type="checkbox" id="target_local" name="target_customers[]" value="local_community"> Local Community</label>
                                        <label class="checkbox-label"><input type="checkbox" id="target_art_design" name="target_customers[]" value="art_design_enthusiasts"> Art & Design Enthusiasts</label>
                                    </div>
                                </div>

                                <!-- Store Aesthetic -->
                                <div class="publisher_formfields" data-group="store_aesthetic">
                                    <label class="group-label">Store Aesthetic <span aria-hidden="true">*</span></label>
                                    <div class="checkbox-group">
                                        <label class="checkbox-label"><input type="checkbox" id="aesthetic_minimal" name="store_aesthetic[]" value="minimalist_clean"> Minimalist / Clean</label>
                                        <label class="checkbox-label"><input type="checkbox" id="aesthetic_eclectic" name="store_aesthetic[]" value="eclectic_bohemian"> Eclectic / Bohemian</label>
                                        <label class="checkbox-label"><input type="checkbox" id="aesthetic_industrial" name="store_aesthetic[]" value="industrial_urban"> Industrial / Urban</label>
                                        <label class="checkbox-label"><input type="checkbox" id="aesthetic_sophisticated" name="store_aesthetic[]" value="sophisticated_upscale"> Sophisticated / Upscale</label>
                                        <label class="checkbox-label"><input type="checkbox" id="aesthetic_vintage" name="store_aesthetic[]" value="vintage_retro"> Vintage / Retro</label>
                                        <label class="checkbox-label"><input type="checkbox" id="aesthetic_modern" name="store_aesthetic[]" value="modern_contemporary"> Modern / Contemporary</label>
                                        <label class="checkbox-label"><input type="checkbox" id="aesthetic_cozy" name="store_aesthetic[]" value="cozy_homey"> Cozy / Homey</label>
                                        <label class="checkbox-label"><input type="checkbox" id="aesthetic_artistic" name="store_aesthetic[]" value="artistic_creative"> Artistic / Creative</label>
                                    </div>
                                </div>

                                <!-- Interested Genres -->
                                <div class="publisher_formfields" data-group="interested_genres">
                                    <label class="group-label">Interested Genres</label>
                                    <div class="checkbox-group">
                                        <label class="checkbox-label"><input type="checkbox" id="genre_art" name="interested_genres[]" value="art_design"> Art & Design</label>
                                        <label class="checkbox-label"><input type="checkbox" id="genre_fashion" name="interested_genres[]" value="fashion_style"> Fashion & Style</label>
                                        <label class="checkbox-label"><input type="checkbox" id="genre_lifestyle" name="interested_genres[]" value="lifestyle"> Lifestyle</label>
                                        <label class="checkbox-label"><input type="checkbox" id="genre_music" name="interested_genres[]" value="music"> Music</label>
                                        <label class="checkbox-label"><input type="checkbox" id="genre_politics" name="interested_genres[]" value="politics_current_affairs"> Politics & Current Affairs</label>
                                        <label class="checkbox-label"><input type="checkbox" id="genre_travel" name="interested_genres[]" value="travel"> Travel</label>
                                        <label class="checkbox-label"><input type="checkbox" id="genre_culture" name="interested_genres[]" value="culture_society"> Culture & Society</label>
                                        <label class="checkbox-label"><input type="checkbox" id="genre_food" name="interested_genres[]" value="food_drink"> Food & Drink</label>
                                        <label class="checkbox-label"><input type="checkbox" id="genre_lit" name="interested_genres[]" value="literature_poetry"> Literature & Poetry</label>
                                        <label class="checkbox-label"><input type="checkbox" id="genre_photo" name="interested_genres[]" value="photography"> Photography</label>
                                        <label class="checkbox-label"><input type="checkbox" id="genre_science" name="interested_genres[]" value="science_technology"> Science & Technology</label>
                                        <label class="checkbox-label"><input type="checkbox" id="genre_indie" name="interested_genres[]" value="independent_zines"> Independent / Zines</label>
                                    </div>
                                </div>

                            </div> <!-- .publisher_form_input_display -->
                        </div> <!-- .form-step -->
                        <!-- Step 5 -->
                        <div class="form-step">
                            <div class="uptitle-section-title">Bussiness Operations</div>

                            <div class="publisher_form_input_display">
                                <div class="publisher_formfields">
                                    <label for="pos_system">POS System</label>
                                    <select class="uptitle-input-text" id="pos_system" name="pos_system" required>
                                        <option value="" disabled selected hidden>Select POS System</option>
                                        <option value="square">Square</option>
                                        <option value="shopify_pos">Shopify POS</option>
                                        <option value="clover">Clover</option>
                                        <option value="toast">Toast</option>
                                        <option value="lightspeed">LightSpeed</option>
                                        <option value="vend">Vend</option>
                                        <option value="cash_register">Cash Register</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div class="publisher_formfields">
                                    <label for="issue_frequency">Issue Frequency</label>
                                    <select class="uptitle-input-text" id="issue_frequency" name="issue_frequency" required>
                                        <option value="" disabled selected hidden>Issue Frequency</option>
                                        <option value="monthly">Monthly</option>
                                        <option value="quarterly">Quarterly</option>
                                        <option value="bi-annual">Bi-annual</option>
                                        <option value="annual">Annual</option>
                                        <option value="irregular">Irregular</option>
                                    </select>
                                </div>
                                <div class="publisher_formfields">
                                    <label for="monthly_budget">Monthly Magazine Budget ($)</label>
                                    <input type="number" id="monthly_budget" class="uptitle-input-text" name="monthly_budget" placeholder="e.g , 500" step="0.01" required>
                                </div>


                            </div>
                            <div class="publisher_formfields" style="margin-top:15px;">
                                <label for="magazine_titles">Current Magazine Titles</label>
                                <textarea class="uptitle-input-text" id="magazine_titles" name="magazine_titles" placeholder="List magazine you currently stock (comma-seprated)" rows="3"></textarea>
                            </div>
                            <div class="publisher_formfields">
                                <label>Current Magazine Sources</label>
                                <div class="checkbox-group" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 8px; margin-top: 8px;">
                                    <label><input type="checkbox" name="magazine_sources[]" value="small_changes"> Small Changes</label>
                                    <label><input type="checkbox" name="magazine_sources[]" value="antenne_books"> Antenne Books</label>
                                    <label><input type="checkbox" name="magazine_sources[]" value="ra_and_olly"> RA & Olly</label>
                                    <label><input type="checkbox" name="magazine_sources[]" value="boutique_mags"> Boutique Mags</label>
                                    <label><input type="checkbox" name="magazine_sources[]" value="ingram_periodicals"> Ingram </label>
                                    <label><input type="checkbox" name="magazine_sources[]" value="direct_from_publishers"> Direct from Publishers</label>
                                    <label><input type="checkbox" name="magazine_sources[]" value="other" id="mag_other"> Other Distributors</label>
                                    <label><input type="checkbox" name="magazine_sources[]" value="none_currently"> None Currently</label>
                                </div>

                                <!-- Optional input for "Other" -->
                                <input type="text" id="mag_other_input" name="mag_other_input" class="uptitle-input-text" placeholder="Please specify other source" style="display:none; margin-top:10px;">
                            </div>

                            <script>
                                // Show/Hide 'Other' input field dynamically
                                document.getElementById('mag_other').addEventListener('change', function() {
                                    const otherInput = document.getElementById('mag_other_input');
                                    otherInput.style.display = this.checked ? 'block' : 'none';
                                });
                            </script>
                        </div>

                        <!-- Step 7 -->
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
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script src="{{ asset('assets/js/retailerregisterform.js') }}"></script>
    <script>
        (function() {
            const step = document.querySelector('.form-step.store-profile');
            if (!step) return;
            const form = step.closest('form');
            if (!form) return;

            const targetGroup = step.querySelector('[data-group="target_customers"]');
            const aestheticGroup = step.querySelector('[data-group="store_aesthetic"]');

            function showError(groupEl, msg) {
                let err = groupEl.querySelector('.field-error');
                if (!err) {
                    err = document.createElement('div');
                    err.className = 'field-error';
                    groupEl.appendChild(err);
                }
                err.textContent = msg;
            }

            function clearError(groupEl) {
                const err = groupEl.querySelector('.field-error');
                if (err) err.remove();
            }

            form.addEventListener('submit', function(e) {
                let valid = true;

                if (targetGroup) {
                    const checked = targetGroup.querySelectorAll('input[type="checkbox"]:checked').length;
                    if (!checked) {
                        showError(targetGroup, 'Please select at least one target customer.');
                        valid = false;
                    } else clearError(targetGroup);
                }

                if (aestheticGroup) {
                    const checked = aestheticGroup.querySelectorAll('input[type="checkbox"]:checked').length;
                    if (!checked) {
                        showError(aestheticGroup, 'Please select at least one store aesthetic.');
                        valid = false;
                    } else clearError(aestheticGroup);
                }

                if (!valid) {
                    e.preventDefault();
                    e.stopPropagation();
                    const firstErr = step.querySelector('.field-error');
                    if (firstErr) firstErr.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            }, {
                passive: false
            });
        })();
    </script>
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