(function () {
    const retailer_form = document.getElementById('multiStepForm');
    if (!retailer_form) return;

    const STORAGE_KEY = 'retailer_form_data';

    // Step navigation variables
    let retailer_currentStep = 0;
    let retailer_steps = Array.from(retailer_form.querySelectorAll('.form-step'));
    const retailer_stepIndicator = document.getElementById('stepIndicator');
    const retailer_progressText = document.getElementById('progressText');
    const retailer_prevBtn = document.getElementById('prevBtn');
    const retailer_nextBtn = document.getElementById('nextBtn');
    const retailer_reviewStep = document.getElementById('review_step');
    const retailer_summaryList = document.getElementById('summaryList');
    const retailer_editAllBtn = document.getElementById('editAllBtn');
    const retailer_finalSubmitBtn = document.getElementById('finalSubmitBtn');

    // ===== FORM PERSISTENCE =====
    function retailer_saveFormData() {
        const formData = new FormData(retailer_form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            // Skip CSRF token - it should never be persisted
            if (key === '_token') continue;

            if (data[key]) {
                if (!Array.isArray(data[key])) {
                    data[key] = [data[key]];
                }
                data[key].push(value);
            } else {
                data[key] = value;
            }
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function retailer_loadFormData() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return;
        
        const data = JSON.parse(saved);
        for (let [key, value] of Object.entries(data)) {
            const inputs = retailer_form.querySelectorAll(`[name="${key}"]`);
            if (inputs.length === 1) {
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
    }

    function retailer_clearFormData() {
        localStorage.removeItem(STORAGE_KEY);
    }

    // Load form data on page load
    retailer_loadFormData();

    // Save form data on input
    retailer_form.addEventListener('input', retailer_saveFormData);
    retailer_form.addEventListener('change', retailer_saveFormData);

    // ===== STEP NAVIGATION FUNCTIONS =====
    function retailer_showStep(n) {
        retailer_steps = Array.from(retailer_form.querySelectorAll('.form-step'));
        retailer_steps.forEach((retailer_s, retailer_i) => retailer_s.classList.toggle('active', retailer_i === n));
        retailer_stepIndicator && (retailer_stepIndicator.textContent = `Step ${n + 1} of ${retailer_steps.length}`);
        retailer_progressText && (retailer_progressText.textContent = `${Math.round(((n + 1) / retailer_steps.length) * 100)}% Complete`);
        retailer_prevBtn && (retailer_prevBtn.style.display = n === 0 ? 'none' : 'inline-block');
        if (retailer_nextBtn) {
            retailer_nextBtn.textContent = (n === retailer_steps.length - 1) ? 'Submit' : 'Continue';
            retailer_nextBtn.style.display = retailer_reviewStep && n === retailer_steps.length - 1 ? 'none' : 'inline-block';
        }
        // if reaching review step, populate
        if (retailer_reviewStep && n === retailer_steps.length - 1) {
            retailer_populateSummary();
        }
        const retailer_firstInput = retailer_steps[n].querySelector('input, textarea, select');
        if (retailer_firstInput) retailer_firstInput.focus();
    }

    function retailer_validateStep(n) {
        const retailer_fields = Array.from(retailer_steps[n].querySelectorAll('.publisher_formfields'));
        let retailer_valid = true;

        for (const retailer_field of retailer_fields) {
            const retailer_input = retailer_field.querySelector('input, textarea, select');
            const retailer_isVisible = retailer_field.offsetParent !== null;
            const retailer_parentContainer = retailer_field.closest('div[style*="display:none"]');
            const retailer_shouldValidate = retailer_input && retailer_input.hasAttribute('required') && retailer_isVisible && !retailer_parentContainer;

            let oldError = retailer_field.querySelector('.error-message');
            if (oldError) oldError.remove();

            if (retailer_shouldValidate && !String(retailer_input.value || '').trim()) {
                retailer_field.classList.add('showerror');
                retailer_valid = false;

                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.style.color = 'red';
                errorMsg.style.fontSize = '12px';
                errorMsg.style.marginTop = '0px';
                errorMsg.textContent = `${retailer_input.getAttribute('name')?.replace(/_/g, ' ') || 'This field'} is required`;
                retailer_field.appendChild(errorMsg);

                if (!retailer_form._focusedInvalid) {
                    retailer_input.focus();
                    retailer_form._focusedInvalid = true;
                }
            } else {
                retailer_field.classList.remove('showerror');
            }
        }

        retailer_form._focusedInvalid = false;
        return retailer_valid;
    }

    function retailer_populateSummary() {
        if (!retailer_summaryList) return;
        retailer_summaryList.innerHTML = '';
        const formData = new FormData(retailer_form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            if (data[key]) {
                if (!Array.isArray(data[key])) {
                    data[key] = [data[key]];
                }
                data[key].push(value);
            } else {
                data[key] = value;
            }
        }

        for (let [key, value] of Object.entries(data)) {
            if (key === 'role' || key === '_token') continue;
            const fieldName = retailer_formatFieldName(key);
            const displayValue = retailer_formatDisplayValue(value);
            const summaryItem = document.createElement('div');
            summaryItem.style.cssText = 'padding: 10px 0; border-bottom: 1px solid #eee;';
            summaryItem.innerHTML = `<strong>${fieldName}:</strong> ${displayValue}`;
            retailer_summaryList.appendChild(summaryItem);
        }
    }

    // ===== FIELD NAME FORMATTER =====
    function retailer_formatFieldName(fieldName) {
        const fieldNameMap = {
            'buyer_name': 'Buyer Name',
            'email_address': 'Email Address',
            'phone_number': 'Phone Number',
            'password': 'Password',
            'storename': 'Store Name',
            'bussinesyears': 'Years In Business',
            'storecategory': 'Store Category',
            'store_type': 'Store Type',
            'store_size': 'Store Size',
            'address_line1': 'Address Line 1',
            'address_line2': 'Address Line 2',
            'city': 'City',
            'state': 'State',
            'zip_code': 'Zip Code',
            'target_customers': 'Target Customers',
            'store_aesthetic': 'Store Aesthetic',
            'interested_genres': 'Interested Genres',
            'pos_system': 'POS System',
            'issue_frequency': 'Issue Frequency',
            'monthly_budget': 'Monthly Budget',
            'magazine_titles': 'Magazine Titles',
            'magazine_sources': 'Magazine Sources',
            'mag_other_input': 'Other Magazine Source',
        };
        return fieldNameMap[fieldName] || fieldName.replace(/_/g, ' ');
    }

    // ===== FORMAT DISPLAY VALUE =====
    function retailer_formatDisplayValue(value) {
        if (Array.isArray(value)) {
            // Remove [] and format each value
            return value.map(v => {
                // Convert snake_case to Title Case
                return v.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            }).join(', ');
        }
        // Convert snake_case to Title Case for single values
        return value.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    // ===== BUTTON EVENT LISTENERS =====
    retailer_prevBtn?.addEventListener('click', () => {
        if (retailer_currentStep > 0) {
            retailer_currentStep--;
            retailer_showStep(retailer_currentStep);
        }
    });

    retailer_nextBtn?.addEventListener('click', () => {
        retailer_steps = Array.from(retailer_form.querySelectorAll('.form-step'));
        if (retailer_currentStep < retailer_steps.length - 1) {
            if (!retailer_validateStep(retailer_currentStep)) return;
            retailer_saveFormData();
            retailer_currentStep++;
            retailer_showStep(retailer_currentStep);
        } else {
            if (!retailer_validateStep(retailer_currentStep)) return;
            retailer_saveFormData();
            retailer_nextBtn.disabled = true;
            retailer_nextBtn.textContent = 'Submitting...';
            retailer_form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        }
    });

    retailer_editAllBtn?.addEventListener('click', () => {
        retailer_currentStep = 0;
        retailer_showStep(retailer_currentStep);
    });

    retailer_form.addEventListener('input', function (retailer_e) {
        const retailer_field = retailer_e.target.closest('.publisher_formfields');
        if (retailer_field && retailer_field.classList.contains('showerror') && retailer_e.target.value.trim()) {
            retailer_field.classList.remove('showerror');
        }
    });

    retailer_form.addEventListener('keydown', function (retailer_e) {
        if (retailer_e.key === 'Enter') {
            const retailer_active = document.activeElement;
            if (retailer_active && retailer_active.tagName.toLowerCase() === 'textarea') return;
            retailer_e.preventDefault();
            if (retailer_currentStep < retailer_steps.length - 1) {
                if (!retailer_validateStep(retailer_currentStep)) return;
                retailer_saveFormData();
                retailer_currentStep++;
                retailer_showStep(retailer_currentStep);
            } else {
                if (!retailer_validateStep(retailer_currentStep)) return;
                retailer_saveFormData();
                retailer_form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
            }
        }
    });

    // Initialize the first step
    retailer_showStep(retailer_currentStep);

    // ===== FORM SUBMISSION =====
    retailer_form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Save form data before submitting
        retailer_saveFormData();

        // Submit via AJAX to handle errors without page reload
        const formData = new FormData(retailer_form);

        fetch(retailer_form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            },
            credentials: 'same-origin',
            redirect: 'follow'
        })
        .then(response => {
            // Check if response is a redirect (status 200-299 after following redirect)
            if (response.ok && response.status !== 422) {
                // Success - clear saved data and redirect
                retailer_clearFormData();
                // Redirect to the final URL after following redirects
                window.location.href = response.url || '/retailer/dashboard';
            } else if (response.status === 422) {
                // Validation errors - show them in a user-friendly way
                return response.json().then(data => {
                    let errorHtml = '<div style="text-align: left; max-height: 400px; overflow-y: auto;">';
                    errorHtml += '<strong style="font-size: 16px;">Please fix the following errors:</strong><br><br>';

                    if (data.errors) {
                        for (let field in data.errors) {
                            const fieldName = retailer_formatFieldName(field);
                            const errors = data.errors[field];
                            errorHtml += `<strong>${fieldName}:</strong><br>`;
                            errors.forEach(error => {
                                errorHtml += `• ${error}<br>`;
                            });
                            errorHtml += '<br>';
                        }
                    }
                    errorHtml += '</div>';

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
                        errorDiv.remove();
                        overlay.remove();
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
                    overlay.addEventListener('click', () => {
                        errorDiv.remove();
                        overlay.remove();
                    });
                    document.body.appendChild(overlay);
                });
            } else {
                // Other errors
                return response.text().then(text => {
                    alert('Error: ' + text);
                });
            }
        })
        .catch(error => {
            console.error('Form submission error:', error);
            alert('Error submitting form: ' + error.message);
        });
    });
})();

