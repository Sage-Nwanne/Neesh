(function () {
    const retailer_form = document.getElementById('multiStepForm');
    if (!retailer_form) return;

    const STORAGE_KEY = 'retailer_form_data';

    // ===== FORM PERSISTENCE =====
    function retailer_saveFormData() {
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
            }
        })
        .then(response => {
            if (response.ok) {
                // Success - clear saved data and redirect
                retailer_clearFormData();
                window.location.href = response.url || '/dashboard';
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
            alert('Error submitting form: ' + error.message);
        });
    });
})();

