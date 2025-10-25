(function () {
    console.log('Publisher registration form script loading...');

    const publisher_form = document.getElementById('multiStepForm');
    console.log('Form element found:', publisher_form);

    if (!publisher_form) {
        console.error('ERROR: multiStepForm not found in DOM!');
        return;
    }

    let publisher_steps = Array.from(publisher_form.querySelectorAll('.form-step'));
    const publisher_stepIndicator = document.getElementById('stepIndicator');
    const publisher_progressText = document.getElementById('progressText');
    const publisher_prevBtn = document.getElementById('prevBtn');
    const publisher_nextBtn = document.getElementById('nextBtn');
    const publisher_reviewStep = document.getElementById('review_step');
    const publisher_summaryList = document.getElementById('summaryList');
    const publisher_editAllBtn = document.getElementById('editAllBtn');
    const publisher_finalSubmitBtn = document.getElementById('finalSubmitBtn');

    console.log('All form elements loaded:', {
        form: !!publisher_form,
        nextBtn: !!publisher_nextBtn,
        finalSubmitBtn: !!publisher_finalSubmitBtn
    });

    const publisher_coverUpload = document.getElementById('coverUpload');
    const publisher_previewContainer = document.getElementById('previewContainer');
    const publisher_MAX_FILES = 6;
    let publisher_selectedFiles = [];

    const publisher_forgetLink = document.getElementById("forgetPasswordLink");
    const publisher_emailInput = document.getElementById("publisheremail");
    const publisher_emailField = publisher_emailInput ? publisher_emailInput.closest(".publisher_formfields") : null;

    let publisher_currentStep = 0;

    // ===== FORM PERSISTENCE =====
    const STORAGE_KEY = 'publisher_form_data';
    const FILES_STORAGE_KEY = 'publisher_form_files';
    let publisher_hasUnsavedChanges = false;

    function publisher_saveFormData() {
        const formData = new FormData(publisher_form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            if (key !== 'files') {
                if (data[key]) {
                    if (!Array.isArray(data[key])) {
                        data[key] = [data[key]];
                    }
                    data[key].push(value);
                } else {
                    data[key] = value;
                }
            }
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        publisher_hasUnsavedChanges = true;
    }

    function publisher_loadFormData() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return;

        const data = JSON.parse(saved);
        for (let [key, value] of Object.entries(data)) {
            const inputs = publisher_form.querySelectorAll(`[name="${key}"]`);
            if (inputs.length === 1) {
                // Skip file inputs - they cannot have their value set programmatically
                if (inputs[0].type === 'file') continue;
                inputs[0].value = value;
            } else if (inputs.length > 1) {
                // Handle checkboxes/radio buttons
                inputs.forEach(input => {
                    if (Array.isArray(value)) {
                        input.checked = value.includes(input.value);
                    } else {
                        input.checked = input.value === value;
                    }
                });
            }
        }
        publisher_hasUnsavedChanges = true;
    }

    function publisher_clearFormData() {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(FILES_STORAGE_KEY);
        publisher_hasUnsavedChanges = false;
    }

    // Load form data on page load
    publisher_loadFormData();

    function publisher_validateEmail(email) {
        const publisher_re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return publisher_re.test(String(email || '').toLowerCase());
    }

    function publisher_showStep(n) {
        publisher_steps = Array.from(publisher_form.querySelectorAll('.form-step'));
        publisher_steps.forEach((publisher_s, publisher_i) => publisher_s.classList.toggle('active', publisher_i === n));
        publisher_stepIndicator && (publisher_stepIndicator.textContent = `Step ${n + 1} of ${publisher_steps.length}`);
        publisher_progressText && (publisher_progressText.textContent = `${Math.round(((n + 1) / publisher_steps.length) * 100)}% Complete`);
        publisher_prevBtn && (publisher_prevBtn.style.display = n === 0 ? 'none' : 'inline-block');
        if (publisher_nextBtn) {
            publisher_nextBtn.textContent = (n === publisher_steps.length - 1) ? 'Submit' : 'Continue';
            publisher_nextBtn.style.display = publisher_reviewStep && n === publisher_steps.length - 1 ? 'none' : 'inline-block';
        }
        // if reaching review step, populate
        if (publisher_reviewStep && n === publisher_steps.length - 1) {
            publisher_populateSummary();
        }
        const publisher_firstInput = publisher_steps[n].querySelector('input, textarea, select');
        if (publisher_firstInput) publisher_firstInput.focus();
    }

    // validation for a step index
   function publisher_validateStep(n) {
    const publisher_fields = Array.from(publisher_steps[n].querySelectorAll('.publisher_formfields'));
    let publisher_valid = true;

    for (const publisher_field of publisher_fields) {
        const publisher_input = publisher_field.querySelector('input, textarea, select');
        const publisher_isVisible = publisher_field.offsetParent !== null;
        // Check if the parent container is hidden
        const publisher_parentContainer = publisher_field.closest('div[style*="display:none"]');
        const publisher_shouldValidate = publisher_input && publisher_input.hasAttribute('required') && publisher_isVisible && !publisher_parentContainer;

        // Remove any old error message
        let oldError = publisher_field.querySelector('.error-message');
        if (oldError) oldError.remove();

        if (publisher_shouldValidate && !String(publisher_input.value || '').trim()) {
            publisher_field.classList.add('showerror');
            publisher_valid = false;

            // Create and append error message
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.style.color = 'red';
            errorMsg.style.fontSize = '12px';
            errorMsg.style.marginTop = '0px';
            errorMsg.textContent = `${publisher_input.getAttribute('name')?.replace(/_/g, ' ') || 'This field'} is required`;
            publisher_field.appendChild(errorMsg);

            if (!publisher_form._focusedInvalid) {
                publisher_input.focus();
                publisher_form._focusedInvalid = true;
            }
        } else {
            publisher_field.classList.remove('showerror');
        }

        // Strict email check on step 0
        if (n === 0 && publisher_input && publisher_input.type === 'email') {
            const oldEmailError = publisher_field.querySelector('.error-message');
            if (!publisher_validateEmail(publisher_input.value.trim())) {
                publisher_field.classList.add('showerror');
                publisher_valid = false;

                if (oldEmailError) oldEmailError.remove();

                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.style.color = 'red';
                errorMsg.style.fontSize = '12px';
                errorMsg.style.marginTop = '4px';
                errorMsg.textContent = 'Please enter a valid email address';
                publisher_field.appendChild(errorMsg);

                if (!publisher_form._focusedInvalid) {
                    publisher_input.focus();
                    publisher_form._focusedInvalid = true;
                }
            } else {
                publisher_field.classList.remove('showerror');
            }
        }

        // Password length check on step 0
        if (n === 0 && publisher_input && publisher_input.type === 'password') {
            const oldPasswordError = publisher_field.querySelector('.error-message');
            const passwordValue = publisher_input.value || '';
            if (passwordValue.length < 6) {
                publisher_field.classList.add('showerror');
                publisher_valid = false;

                if (oldPasswordError) oldPasswordError.remove();

                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.style.color = 'red';
                errorMsg.style.fontSize = '12px';
                errorMsg.style.marginTop = '4px';
                errorMsg.textContent = 'Password must be at least 6 characters';
                publisher_field.appendChild(errorMsg);

                if (!publisher_form._focusedInvalid) {
                    publisher_input.focus();
                    publisher_form._focusedInvalid = true;
                }
            } else {
                publisher_field.classList.remove('showerror');
            }
        }

        // Numeric field validation (min > 0)
        if (publisher_input && publisher_input.type === 'number' && publisher_shouldValidate) {
            const oldNumError = publisher_field.querySelector('.error-message');
            const numValue = parseFloat(publisher_input.value || 0);
            const fieldName = publisher_input.getAttribute('name') || 'This field';

            if (numValue <= 0) {
                publisher_field.classList.add('showerror');
                publisher_valid = false;

                if (oldNumError) oldNumError.remove();

                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.style.color = 'red';
                errorMsg.style.fontSize = '12px';
                errorMsg.style.marginTop = '4px';
                errorMsg.textContent = `${fieldName.replace(/_/g, ' ')} must be greater than 0`;
                publisher_field.appendChild(errorMsg);

                if (!publisher_form._focusedInvalid) {
                    publisher_input.focus();
                    publisher_form._focusedInvalid = true;
                }
            }
        }
    }

    publisher_form._focusedInvalid = false;
    return publisher_valid;
}

    // series toggle
    const publisher_radioSingle = document.getElementById('single_issue');
    const publisher_radioSeries = document.getElementById('series');
    const publisher_seriesFields = document.getElementById('series_fields');
    const publisher_seriesInputs = publisher_seriesFields ? Array.from(publisher_seriesFields.querySelectorAll('input')) : [];

    function publisher_setSeriesVisible(visible) {
        if (!publisher_seriesFields) return;
        if (visible) {
            publisher_seriesFields.classList.add('show');
            publisher_seriesFields.setAttribute('aria-hidden', 'false');
            publisher_seriesInputs.forEach(publisher_i => publisher_i.setAttribute('required', ''));
        } else {
            publisher_seriesFields.classList.remove('show');
            publisher_seriesFields.setAttribute('aria-hidden', 'true');
            publisher_seriesInputs.forEach(publisher_i => publisher_i.removeAttribute('required'));
            publisher_seriesFields.querySelectorAll('.publisher_formfields').forEach(publisher_f => publisher_f.classList.remove('showerror'));
        }
    }
    publisher_setSeriesVisible(false);
    publisher_radioSingle?.addEventListener('change', () => publisher_radioSingle.checked && publisher_setSeriesVisible(false));
    publisher_radioSeries?.addEventListener('change', () => publisher_radioSeries.checked && publisher_setSeriesVisible(true));

    // file previews
    function publisher_renderPreviews() {
        console.log("publisher_selectedFiles:", publisher_selectedFiles);
        if (!publisher_previewContainer) return;
        publisher_previewContainer.innerHTML = '';
        publisher_selectedFiles.forEach((publisher_file, publisher_idx) => {
            const publisher_reader = new FileReader();
            const publisher_wrapper = document.createElement('div');
            publisher_wrapper.className = 'preview-item';
            const publisher_removeBtn = document.createElement('span');
            publisher_removeBtn.className = 'remove';
            publisher_removeBtn.textContent = '✖';

            publisher_removeBtn.addEventListener('click', publisher_ev => {
                publisher_ev.stopPropagation();
                publisher_selectedFiles.splice(publisher_idx, 1);
                publisher_renderPreviews();
            });

            publisher_reader.onload = publisher_e => {
                const publisher_img = document.createElement('img');
                publisher_img.src = publisher_e.target.result;
                publisher_img.style.maxWidth = '120px';
                publisher_img.style.borderRadius = '6px';
                publisher_wrapper.appendChild(publisher_img);
                publisher_wrapper.appendChild(publisher_removeBtn);
            };
            publisher_reader.readAsDataURL(publisher_file);
            publisher_previewContainer.appendChild(publisher_wrapper);
        });
    }

    // Image size validation constants
    const publisher_MIN_FILE_SIZE = 100 * 1024; // 100 KB in bytes
    const publisher_MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB in bytes

    publisher_coverUpload?.addEventListener('change', function () {
            console.log("publisher_coverUpload.files:", publisher_coverUpload.files);

        const publisher_files = Array.from(this.files || []);

        // Check total file count
        if (publisher_selectedFiles.length + publisher_files.length > publisher_MAX_FILES) {
            alert(`You can only upload up to ${publisher_MAX_FILES} images.`);
            try {
                this.value = '';
            } catch (e) {
                // File input value cannot be set, ignore
            }
            return;
        }

        // Filter for images and validate sizes
        const publisher_images = publisher_files.filter(p => p.type && p.type.startsWith('image/'));
        const publisher_validImages = [];
        let publisher_hasErrors = false;

        publisher_images.forEach(file => {
            if (file.size < publisher_MIN_FILE_SIZE) {
                alert(`⚠️ Image too small: "${file.name}"\n\nMinimum file size: 100 KB\nYour file size: ${(file.size / 1024).toFixed(2)} KB\n\nPlease upload a larger image.`);
                publisher_hasErrors = true;
            } else if (file.size > publisher_MAX_FILE_SIZE) {
                alert(`⚠️ Image too large: "${file.name}"\n\nMaximum file size: 5 MB\nYour file size: ${(file.size / (1024 * 1024)).toFixed(2)} MB\n\nPlease upload a smaller image.`);
                publisher_hasErrors = true;
            } else {
                publisher_validImages.push(file);
            }
        });

        if (publisher_hasErrors && publisher_validImages.length === 0) {
            try {
                this.value = '';
            } catch (e) {
                // File input value cannot be set, ignore
            }
            return;
        }

        publisher_selectedFiles = publisher_selectedFiles.concat(publisher_validImages);
        publisher_renderPreviews();
        try {
            this.value = '';
        } catch (e) {
            // File input value cannot be set, ignore
        }
    });

    publisher_forgetLink?.addEventListener('click', function (publisher_e) {
        const publisher_val = publisher_emailInput?.value.trim() || '';
        if (!publisher_val || !publisher_validateEmail(publisher_val)) {
            publisher_e.preventDefault();
            publisher_emailField && publisher_emailField.classList.add('showerror');
            publisher_emailInput && publisher_emailInput.focus();
        } else {
            publisher_emailField && publisher_emailField.classList.remove('showerror');
            localStorage.setItem('resetEmail', publisher_val);
        }
    });

    publisher_prevBtn?.addEventListener('click', () => {
        if (publisher_currentStep > 0) {
            publisher_currentStep--;
            publisher_showStep(publisher_currentStep);
        }
    });

    // Track if form is being submitted
    let publisher_isSubmitting = false;

    // Warn user on page reload if form has data (but not on form submission)
    window.addEventListener('beforeunload', (e) => {
        // Don't warn if form is being submitted
        if (publisher_isSubmitting) return;

        // Only warn if there are unsaved changes
        if (publisher_hasUnsavedChanges || publisher_selectedFiles.length > 0) {
            e.preventDefault();
            e.returnValue = '';
            return '';
        }
    });

    // Clear localStorage when user actually leaves the page
    function publisher_unloadHandler() {
        // Only clear if NOT submitting (user clicked "Leave" on the alert)
        if (!publisher_isSubmitting) {
            publisher_clearFormData();
            publisher_selectedFiles = [];
        }
    }
    window.addEventListener('unload', publisher_unloadHandler);

    console.log('Attaching click listener to nextBtn...');
    publisher_nextBtn?.addEventListener('click', () => {
        console.log('NEXT BUTTON CLICKED! Current step:', publisher_currentStep);
        publisher_steps = Array.from(publisher_form.querySelectorAll('.form-step'));
        if (publisher_currentStep < publisher_steps.length - 1) {
            if (!publisher_validateStep(publisher_currentStep)) return;
            publisher_saveFormData(); // Save before moving to next step
            publisher_currentStep++;
            publisher_showStep(publisher_currentStep);
        } else {
            if (!publisher_validateStep(publisher_currentStep)) return;
            publisher_saveFormData(); // Save before submitting
            // Disable the button to prevent double submission
            publisher_nextBtn.disabled = true;
            publisher_nextBtn.textContent = 'Submitting...';
            // Trigger the submit event instead of calling .submit() directly
            // This ensures the form's submit event listener is called
            publisher_form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        }
    });

    publisher_form.addEventListener('input', function (publisher_e) {
        const publisher_field = publisher_e.target.closest('.publisher_formfields');
        if (publisher_field && publisher_field.classList.contains('showerror') && publisher_e.target.value.trim()) {
            publisher_field.classList.remove('showerror');
        }
        // Mark that user has made changes
        publisher_hasUnsavedChanges = true;
    });

    publisher_form.addEventListener('change', function (publisher_e) {
        // Mark that user has made changes (for select, checkbox, radio)
        publisher_hasUnsavedChanges = true;
    });

    publisher_form.addEventListener('keydown', function (publisher_e) {
        if (publisher_e.key === 'Enter') {
            const publisher_active = document.activeElement;
            if (publisher_active && publisher_active.tagName.toLowerCase() === 'textarea') return;
            publisher_e.preventDefault();
            if (publisher_currentStep < publisher_steps.length - 1) {
                if (!publisher_validateStep(publisher_currentStep)) return;
                publisher_saveFormData(); // Save before moving to next step
                publisher_currentStep++;
                publisher_showStep(publisher_currentStep);
            } else {
                if (!publisher_validateStep(publisher_currentStep)) return;
                publisher_saveFormData(); // Save before submitting
                // Trigger the submit event instead of calling .submit() directly
                publisher_form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
            }
        }
    });

    // publisher_form.addEventListener('submit', function (publisher_e) {
    //         // console.log("publisher_coverUpload.files:", publisher_coverUpload.files);

    //     if (publisher_coverUpload && publisher_selectedFiles.length) {
    //         const publisher_dt = new DataTransfer();
    //         publisher_selectedFiles.forEach(pf => publisher_dt.items.add(pf));
    //         publisher_coverUpload.files = publisher_dt.files;
    //     }
    // });
// Define this outside the event listener so we can reference it later
let publisher_preventPageNavigation = null;

console.log('Attaching submit event listener to form...');
publisher_form.addEventListener('submit', function (e) {
    console.log('SUBMIT EVENT LISTENER TRIGGERED!');
    e.preventDefault();
    e.stopPropagation();

    console.log('=== FORM SUBMISSION STARTED ===');
    console.log('Form action:', publisher_form.action);
    console.log('Is submitting:', publisher_isSubmitting);

    // Mark that we're submitting to prevent beforeunload warning
    publisher_isSubmitting = true;

    // Disable the unload listener temporarily so page doesn't clear data on error
    window.removeEventListener('unload', publisher_unloadHandler);

    // Prevent page navigation while waiting for response
    publisher_preventPageNavigation = (e) => {
        e.preventDefault();
        console.log('Page navigation prevented during form submission');
    };
    window.addEventListener('beforeunload', publisher_preventPageNavigation);

    // Submit via AJAX to handle errors without page reload
    const formData = new FormData(publisher_form);

    // Add selected files to FormData
    if (publisher_selectedFiles.length) {
        // Remove any existing files from FormData
        formData.delete('files[]');
        // Add our selected files
        publisher_selectedFiles.forEach(file => {
            formData.append('files[]', file);
        });
    }

    console.log('Sending AJAX request with X-Requested-With header');
    console.log('Form data keys:', Array.from(formData.keys()));

    const fetchPromise = fetch(publisher_form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
        }
    });

    console.log('Fetch promise created:', fetchPromise);

    fetchPromise
    .then(response => {
        console.log('=== RESPONSE RECEIVED ===');
        console.log('Response status:', response.status, response.statusText);
        console.log('Response ok:', response.ok);
        console.log('Response type:', response.type);
        console.log('Response url:', response.url);

        if (response.ok) {
            console.log('Response is OK (200-299)');
            window.removeEventListener('beforeunload', publisher_preventPageNavigation);
            // Success - parse JSON response
            return response.json().then(data => {
                console.log('Success response data:', data);
                // Clear saved data ONLY on successful submission
                publisher_clearFormData();

                // Show success message
                const successDiv = document.createElement('div');
                successDiv.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    border: 2px solid #27ae60;
                    border-radius: 8px;
                    padding: 24px;
                    max-width: 500px;
                    z-index: 10000;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                    text-align: center;
                `;
                successDiv.innerHTML = `<strong style="font-size: 18px; color: #27ae60;">✅ Success!</strong><br><br>${data.message}<br><br><button id="closeSuccessBtn" style="margin-top: 16px; padding: 10px 20px; background: #27ae60; color: white; border: none; border-radius: 4px; cursor: pointer;">OK</button>`;
                document.body.appendChild(successDiv);

                document.getElementById('closeSuccessBtn').addEventListener('click', () => {
                    successDiv.remove();
                    overlay.remove();
                    // Redirect after user clicks OK
                    window.location.href = data.redirect || '/';
                });

                // Also add overlay
                const overlay = document.createElement('div');
                overlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    z-index: 9999;
                `;
                document.body.appendChild(overlay);
            });
        } else if (response.status === 422) {
            console.log('Validation error (422)');
            window.removeEventListener('beforeunload', publisher_preventPageNavigation);
            // Validation errors - show them in a user-friendly way
            // Re-enable the submit button
            if (publisher_nextBtn) {
                publisher_nextBtn.disabled = false;
                publisher_nextBtn.textContent = 'Submit';
            }

            // Reset submitting flag so user can try again
            publisher_isSubmitting = false;

            // Re-enable the unload handler
            window.addEventListener('unload', publisher_unloadHandler);

            return response.json().then(data => {
                console.log('Validation error data:', data);
                let errorHtml = '<div style="text-align: left; max-height: 400px; overflow-y: auto;">';
                errorHtml += '<strong style="font-size: 16px;">Please fix the following errors:</strong><br><br>';

                if (data.errors) {
                    for (let field in data.errors) {
                        const fieldName = publisher_formatFieldName(field);
                        const errors = data.errors[field];
                        errorHtml += `<strong>${fieldName}:</strong><br>`;
                        errors.forEach(error => {
                            errorHtml += `• ${error}<br>`;
                        });
                        errorHtml += '<br>';
                    }
                }
                errorHtml += '</div>';

                // Create overlay FIRST
                const overlay = document.createElement('div');
                overlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    z-index: 9999;
                `;
                document.body.appendChild(overlay);

                // Create a custom error dialog
                const errorDiv = document.createElement('div');
                errorDiv.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    border: 2px solid #e74c3c;
                    border-radius: 8px;
                    padding: 24px;
                    max-width: 500px;
                    z-index: 10000;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                `;
                errorDiv.innerHTML = errorHtml + '<button id="closeErrorBtn" style="margin-top: 16px; padding: 10px 20px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>';
                document.body.appendChild(errorDiv);

                document.getElementById('closeErrorBtn').addEventListener('click', () => {
                    console.log('Closing error dialog');
                    errorDiv.remove();
                    overlay.remove();
                    // Reset to step 1 so user can fix errors
                    publisher_currentStep = 0;
                    publisher_showStep(publisher_currentStep);
                });

                overlay.addEventListener('click', () => {
                    console.log('Closing error dialog via overlay');
                    errorDiv.remove();
                    overlay.remove();
                    // Reset to step 1 so user can fix errors
                    publisher_currentStep = 0;
                    publisher_showStep(publisher_currentStep);
                });
            });
        } else {
            console.log('Other error:', response.status);
            window.removeEventListener('beforeunload', publisher_preventPageNavigation);
            // Other errors (500, etc.)
            // Re-enable the submit button
            if (publisher_nextBtn) {
                publisher_nextBtn.disabled = false;
                publisher_nextBtn.textContent = 'Submit';
            }

            // Reset the submitting flag so user can try again
            publisher_isSubmitting = false;

            // Re-enable the unload handler
            window.addEventListener('unload', publisher_unloadHandler);

            return response.json().then(data => {
                console.log('Error response data:', data);

                // Create overlay FIRST
                const overlay = document.createElement('div');
                overlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    z-index: 9999;
                `;
                document.body.appendChild(overlay);

                // Show error dialog
                const errorDiv = document.createElement('div');
                errorDiv.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    border: 2px solid #e74c3c;
                    border-radius: 8px;
                    padding: 24px;
                    max-width: 500px;
                    z-index: 10000;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                `;

                let errorMessage = data.message || 'An error occurred while submitting the form.';
                if (data.error) {
                    errorMessage = data.error;
                }

                errorDiv.innerHTML = `
                    <div style="text-align: left;">
                        <strong style="font-size: 16px; color: #e74c3c;">Error:</strong><br><br>
                        <p>${errorMessage}</p>
                    </div>
                    <button id="closeErrorBtn" style="margin-top: 16px; padding: 10px 20px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
                `;
                document.body.appendChild(errorDiv);

                document.getElementById('closeErrorBtn').addEventListener('click', () => {
                    console.log('Closing error dialog');
                    errorDiv.remove();
                    overlay.remove();
                });

                overlay.addEventListener('click', () => {
                    console.log('Closing error dialog via overlay');
                    errorDiv.remove();
                    overlay.remove();
                });
            }).catch(err => {
                // If response is not JSON, show generic error
                alert('Server Error: ' + response.status + ' ' + response.statusText);
            });
        }
    })
    .catch(error => {
        console.error('Network/Fetch error:', error);
        window.removeEventListener('beforeunload', publisher_preventPageNavigation);
        // Re-enable the submit button
        if (publisher_nextBtn) {
            publisher_nextBtn.disabled = false;
            publisher_nextBtn.textContent = 'Submit';
        }

        // Reset the submitting flag so user can try again
        publisher_isSubmitting = false;

        // Re-enable the unload handler
        window.addEventListener('unload', publisher_unloadHandler);

        alert('Error submitting form: ' + error.message);
    });
});


    // Helper function to convert field names to customer-facing names
    function publisher_formatFieldName(fieldName) {
        const fieldNameMap = {
            'firstname': 'First Name',
            'lastname': 'Last Name',
            'bussinessname': 'Business / Publisher Name',
            'email': 'Email',
            'password': 'Password',
            'magazine_title': 'Full Magazine Title',
            'website_link': 'Website / Social Link',
            'magazinedescription': 'Description',
            'genre': 'Genre(s)',
            'dimensions': 'Dimensions',
            'page_count': 'Page Count',
            'issue_type': 'Issue Type',
            'series_issue_count': 'Issue Number',
            'issue_frequency': 'Issue Frequency',
            'print_run': 'Print Run',
            'available_quantities': 'Available Quantities',
            'wholesale_price': 'Wholesale Price (WSP)',
            'retail_price': 'Suggested Retail Price',
            'specs': 'Additional Specs',
            'fulfillment_method': 'Fulfillment Method',
            'warehouse': 'Warehouse Address',
            'shipping_city': 'Shipping City',
            'shipping_state': 'Shipping State',
            'shipping_country': 'Shipping Country',
            'return_policy': 'Return Policy',
            'sales_experience': 'Have you sold this issue before?',
            'distribution_channels': 'Distribution Channels',
            'copies_sold': 'Estimated Copies Sold',
            'sales_feedback': 'Share relevant press links or reviews of your publication'
        };
        return fieldNameMap[fieldName] || fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    function publisher_populateSummary() {
        if (!publisher_summaryList) return;
        publisher_summaryList.innerHTML = '';
        const publisher_stepElems = Array.from(publisher_form.querySelectorAll('.form-step'));
        publisher_stepElems.forEach((publisher_stepElem, publisher_idx) => {
            if (publisher_stepElem === publisher_reviewStep) return;
            const publisher_title = publisher_stepElem.querySelector('.uptitle-section-title')?.textContent || (`Step ${publisher_idx + 1}`);
            // Skip the Assets step
            if (publisher_title === 'Assets') return;
            const publisher_sectionWrapper = document.createElement('div');
            publisher_sectionWrapper.style.display = 'flex';
            publisher_sectionWrapper.style.flexDirection = 'column';
            const publisher_st = document.createElement('div');
            publisher_st.className = 'summary-step-title';
            publisher_st.textContent = publisher_title;
            publisher_sectionWrapper.appendChild(publisher_st);

            const publisher_controls = Array.from(publisher_stepElem.querySelectorAll('input, textarea, select'));
            publisher_controls.forEach(publisher_ctrl => {
                const publisher_key = publisher_ctrl.placeholder || publisher_ctrl.getAttribute('aria-label') || publisher_formatFieldName(publisher_ctrl.name) || publisher_ctrl.id || 'field';
                let publisher_value = '';

                if (publisher_ctrl.type === 'radio') {
                    if (publisher_ctrl.checked) publisher_value = publisher_ctrl.value;
                } else if (publisher_ctrl.type === 'checkbox') {
                    // Collect all checked checkboxes with same name
                    const groupName = publisher_ctrl.name;
                    const allCheckboxes = Array.from(publisher_form.querySelectorAll(`input[name="${groupName}"]`));
                    const checkedValues = allCheckboxes.filter(cb => cb.checked).map(cb => cb.nextElementSibling?.textContent || cb.value);

                    if (checkedValues.length) {
                        publisher_value = checkedValues.join(', ');
                    } else {
                        publisher_value = '';
                    }

                    // skip duplicates (only process once per group)
                    if (publisher_ctrl !== allCheckboxes[0]) return;
                }
                else if (publisher_ctrl.type === 'file') {
                    if (publisher_selectedFiles.length) {
                        const publisher_imgRow = document.createElement('div');
                        publisher_selectedFiles.forEach(publisher_file => {
                            const publisher_thumb = document.createElement('img');
                            publisher_thumb.className = 'summary-img';
                            const publisher_reader = new FileReader();
                            publisher_reader.onload = publisher_e => publisher_thumb.src = publisher_e.target.result;
                            publisher_reader.readAsDataURL(publisher_file);
                            publisher_imgRow.appendChild(publisher_thumb);
                        });
                        const publisher_item = document.createElement('div');
                        publisher_item.className = 'summary-item';
                        const publisher_k = document.createElement('div');
                        publisher_k.className = 'summary-key';
                        publisher_k.textContent = publisher_key;
                        const publisher_v = document.createElement('div');
                        publisher_v.className = 'summary-val';
                        publisher_v.appendChild(publisher_imgRow);
                        publisher_item.appendChild(publisher_k);
                        publisher_item.appendChild(publisher_v);
                        publisher_sectionWrapper.appendChild(publisher_item);
                    }
                    return;
                } else {
                    publisher_value = (publisher_ctrl.value == null ? '' : String(publisher_ctrl.value));
                }

                if (publisher_value === '') return;

                const publisher_item = document.createElement('div');
                publisher_item.className = 'summary-item';
                const publisher_k = document.createElement('div');
                publisher_k.className = 'summary-key';
                publisher_k.textContent = publisher_key;
                const publisher_v = document.createElement('div');
                publisher_v.className = 'summary-val';
                publisher_v.textContent = publisher_value;
                publisher_item.appendChild(publisher_k);
                publisher_item.appendChild(publisher_v);
                publisher_sectionWrapper.appendChild(publisher_item);
            });

            if (publisher_sectionWrapper.children.length > 1) {
                publisher_summaryList.appendChild(publisher_sectionWrapper);
            }
        });

        if (publisher_selectedFiles.length) {
            const publisher_item = document.createElement('div');
            publisher_item.className = 'summary-item';
            const publisher_k = document.createElement('div');
            publisher_k.className = 'summary-key';
            publisher_k.textContent = 'Images';
            const publisher_v = document.createElement('div');
            publisher_v.className = 'summary-val';
            publisher_selectedFiles.forEach(publisher_file => {
                const publisher_img = document.createElement('img');
                publisher_img.className = 'summary-img';
                const publisher_reader2 = new FileReader();
                publisher_reader2.onload = publisher_e => publisher_img.src = publisher_e.target.result;
                publisher_reader2.readAsDataURL(publisher_file);
                publisher_v.appendChild(publisher_img);
            });
            publisher_item.appendChild(publisher_k);
            publisher_item.appendChild(publisher_v);
            publisher_summaryList.appendChild(publisher_item);
        }
    }

    publisher_editAllBtn?.addEventListener('click', () => {
        publisher_currentStep = 0;
        publisher_showStep(publisher_currentStep);
    });

    publisher_finalSubmitBtn?.addEventListener('click', () => {
        const publisher_idx = Array.from(publisher_form.querySelectorAll('.form-step')).indexOf(publisher_reviewStep);
        if (publisher_idx === -1) return;
        if (!publisher_validateStep(publisher_idx)) return;

        // Trigger the submit event instead of calling .submit() directly
        // This ensures the form's submit event listener is called
        publisher_form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    publisher_steps = Array.from(publisher_form.querySelectorAll('.form-step'));
    publisher_showStep(publisher_currentStep);



    document.querySelectorAll('.publisher-eye-toggle').forEach(icon => {
        icon.addEventListener('click', () => {
            const targetInput = document.getElementById(icon.dataset.target);
            if (targetInput.type === "password") {
                targetInput.type = "text";
                icon.classList.remove("fa-eye");
                icon.classList.add("fa-eye-slash");
            } else {
                targetInput.type = "password";
                icon.classList.remove("fa-eye-slash");
                icon.classList.add("fa-eye");
            }
        });
    });


})();