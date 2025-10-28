(function () {
    const publisher_form = document.getElementById('multiStepForm');
    let publisher_steps = Array.from(publisher_form.querySelectorAll('.form-step'));
    const publisher_stepIndicator = document.getElementById('stepIndicator');
    const publisher_progressText = document.getElementById('progressText');
    const publisher_prevBtn = document.getElementById('prevBtn');
    const publisher_nextBtn = document.getElementById('nextBtn');
    const publisher_reviewStep = document.getElementById('review_step');
    const publisher_summaryList = document.getElementById('summaryList');
    const publisher_editAllBtn = document.getElementById('editAllBtn');
    const publisher_finalSubmitBtn = document.getElementById('finalSubmitBtn');

    const publisher_coverUpload = document.getElementById('coverUpload');
    const publisher_previewContainer = document.getElementById('previewContainer');
    const publisher_MAX_FILES = 6;
    let publisher_selectedFiles = [];

    const publisher_forgetLink = document.getElementById("forgetPasswordLink");
    const publisher_emailInput = document.getElementById("publisheremail");
    const publisher_emailField = publisher_emailInput ? publisher_emailInput.closest(".publisher_formfields") : null;

    let publisher_currentStep = 0;

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
        const publisher_shouldValidate = publisher_input && publisher_input.hasAttribute('required') && publisher_isVisible;

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

    publisher_coverUpload?.addEventListener('change', function () {
            console.log("publisher_coverUpload.files:", publisher_coverUpload.files);

        const publisher_files = Array.from(this.files || []);
        if (publisher_selectedFiles.length + publisher_files.length > publisher_MAX_FILES) {
            alert(`You can only upload up to ${publisher_MAX_FILES} images.`);
            this.value = '';
            return;
        }
        const publisher_images = publisher_files.filter(p => p.type && p.type.startsWith('image/'));
        publisher_selectedFiles = publisher_selectedFiles.concat(publisher_images);
        publisher_renderPreviews();
        this.value = '';
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

    publisher_nextBtn?.addEventListener('click', () => {
        publisher_steps = Array.from(publisher_form.querySelectorAll('.form-step'));
        if (publisher_currentStep < publisher_steps.length - 1) {
            if (!publisher_validateStep(publisher_currentStep)) return;
            publisher_currentStep++;
            publisher_showStep(publisher_currentStep);
        } else {
            if (!publisher_validateStep(publisher_currentStep)) return;
            publisher_form.submit();
        }
    });

    publisher_form.addEventListener('input', function (publisher_e) {
        const publisher_field = publisher_e.target.closest('.publisher_formfields');
        if (publisher_field && publisher_field.classList.contains('showerror') && publisher_e.target.value.trim()) {
            publisher_field.classList.remove('showerror');
        }
    });

    publisher_form.addEventListener('keydown', function (publisher_e) {
        if (publisher_e.key === 'Enter') {
            const publisher_active = document.activeElement;
            if (publisher_active && publisher_active.tagName.toLowerCase() === 'textarea') return;
            publisher_e.preventDefault();
            if (publisher_currentStep < publisher_steps.length - 1) {
                if (!publisher_validateStep(publisher_currentStep)) return;
                publisher_currentStep++;
                publisher_showStep(publisher_currentStep);
            } else {
                if (!publisher_validateStep(publisher_currentStep)) return;
                publisher_form.submit();
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
publisher_form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (publisher_selectedFiles.length) {
        const dt = new DataTransfer();
        publisher_selectedFiles.forEach(file => dt.items.add(file));
        publisher_coverUpload.files = dt.files;
    }

    // Submit via AJAX to handle errors without page reload
    const formData = new FormData(publisher_form);

    fetch(publisher_form.action, {
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
            // Success - redirect to the final URL after following redirects
            window.location.href = response.url || '/publisher/dashboard';
        } else if (response.status === 422) {
            // Validation errors - show them in a user-friendly way
            return response.json().then(data => {
                let errorHtml = '<div style="text-align: left; max-height: 400px; overflow-y: auto;">';
                errorHtml += '<strong style="font-size: 16px;">Please fix the following errors:</strong><br><br>';

                if (data.errors) {
                    for (let [field, messages] of Object.entries(data.errors)) {
                        errorHtml += `<strong>${field}:</strong><br>`;
                        if (Array.isArray(messages)) {
                            messages.forEach(msg => {
                                errorHtml += `• ${msg}<br>`;
                            });
                        } else {
                            errorHtml += `• ${messages}<br>`;
                        }
                        errorHtml += '<br>';
                    }
                }
                errorHtml += '</div>';

                const errorDiv = document.createElement('div');
                errorDiv.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    padding: 30px;
                    border-radius: 8px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                    z-index: 10000;
                    max-width: 500px;
                    width: 90%;
                `;
                errorDiv.innerHTML = errorHtml;
                document.body.appendChild(errorDiv);

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


    // ===== FIELD NAME FORMATTER =====
    function publisher_formatFieldName(fieldName) {
        const fieldNameMap = {
            'firstname': 'First Name',
            'lastname': 'Last Name',
            'email': 'Email',
            'password': 'Password',
            'bussinessname': 'Business / Publisher Name',
            'magazine_title': 'Full Magazine Title',
            'website_link': 'Website / Social Link',
            'magazinedescription': 'Description',
            'issue_type': 'Issue Type',
            'series_issue_count': 'Issue Number or Seasonal ID',
            'issue_frequency': 'Issue Frequency',
            'print_run': 'Print Run',
            'page_count': 'Page Count',
            'genre': 'Genre(s)',
            'dimensions': 'Dimensions',
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
            'sales_feedback': 'What feedback have you received?'
        };
        return fieldNameMap[fieldName] || fieldName.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');
    }

    function publisher_populateSummary() {
        if (!publisher_summaryList) return;
        publisher_summaryList.innerHTML = '';
        const publisher_stepElems = Array.from(publisher_form.querySelectorAll('.form-step'));
        publisher_stepElems.forEach((publisher_stepElem, publisher_idx) => {
            if (publisher_stepElem === publisher_reviewStep) return;
            const publisher_title = publisher_stepElem.querySelector('.uptitle-section-title')?.textContent || (`Step ${publisher_idx + 1}`);
            const publisher_sectionWrapper = document.createElement('div');
            publisher_sectionWrapper.style.display = 'flex';
            publisher_sectionWrapper.style.flexDirection = 'column';
            const publisher_st = document.createElement('div');
            publisher_st.className = 'summary-step-title';
            publisher_st.textContent = publisher_title;
            publisher_sectionWrapper.appendChild(publisher_st);

            const publisher_controls = Array.from(publisher_stepElem.querySelectorAll('input, textarea, select'));
            publisher_controls.forEach(publisher_ctrl => {
                const publisher_fieldName = publisher_ctrl.name || publisher_ctrl.id || 'field';
                const publisher_key = publisher_formatFieldName(publisher_fieldName);
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
            // console.log("publisher_coverUpload.files:", publisher_coverUpload.files);

        if (publisher_coverUpload && publisher_selectedFiles.length) {
            const publisher_dt = new DataTransfer();
            publisher_selectedFiles.forEach(pf => publisher_dt.items.add(pf));
            publisher_coverUpload.files = publisher_dt.files;
        }

        publisher_form.submit();
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