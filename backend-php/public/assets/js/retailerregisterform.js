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
                if (Array.isArray(value)) {
                    inputs.forEach(inp => {
                        if (value.includes(inp.value)) inp.checked = true;
                    });
                }
            }
        }
    }

    // ===== STEP DISPLAY =====
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
        if (retailer_reviewStep && n === retailer_steps.length - 1) {
            retailer_populateSummary();
        }
        const retailer_firstInput = retailer_steps[n].querySelector('input, textarea, select');
        if (retailer_firstInput) retailer_firstInput.focus();
    }

    // ===== VALIDATION =====
    function retailer_validateStep(n) {
        const retailer_fields = Array.from(retailer_steps[n].querySelectorAll('.publisher_formfields'));
        let retailer_valid = true;

        for (const retailer_field of retailer_fields) {
            const retailer_input = retailer_field.querySelector('input, textarea, select');
            const retailer_isVisible = retailer_field.offsetParent !== null;
            const retailer_shouldValidate = retailer_input && retailer_input.hasAttribute('required') && retailer_isVisible;

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

    // ===== SUMMARY POPULATION =====
    function retailer_populateSummary() {
        if (!retailer_summaryList) return;
        retailer_summaryList.innerHTML = '';
        const formData = new FormData(retailer_form);
        const summary = {};

        for (let [key, value] of formData.entries()) {
            if (!summary[key]) summary[key] = [];
            summary[key].push(value);
        }

        for (let [key, values] of Object.entries(summary)) {
            const displayKey = key.replace(/_/g, ' ').toUpperCase();
            const displayValue = values.length === 1 ? values[0] : values.join(', ');
            const summaryItem = document.createElement('div');
            summaryItem.style.cssText = 'padding: 10px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between;';
            summaryItem.innerHTML = `<strong>${displayKey}:</strong> <span>${displayValue}</span>`;
            retailer_summaryList.appendChild(summaryItem);
        }
    }

    // ===== NAVIGATION =====
    function retailer_nextStep() {
        retailer_form._focusedInvalid = false;
        if (retailer_validateStep(retailer_currentStep)) {
            retailer_saveFormData();
            if (retailer_currentStep < retailer_steps.length - 1) {
                retailer_currentStep++;
                retailer_showStep(retailer_currentStep);
                window.scrollTo(0, 0);
            }
        }
    }

    function retailer_prevStep() {
        retailer_saveFormData();
        if (retailer_currentStep > 0) {
            retailer_currentStep--;
            retailer_showStep(retailer_currentStep);
            window.scrollTo(0, 0);
        }
    }

    // ===== EVENT LISTENERS =====
    retailer_nextBtn && retailer_nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        retailer_nextStep();
    });

    retailer_prevBtn && retailer_prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        retailer_prevStep();
    });

    retailer_editAllBtn && retailer_editAllBtn.addEventListener('click', (e) => {
        e.preventDefault();
        retailer_currentStep = 0;
        retailer_showStep(retailer_currentStep);
        window.scrollTo(0, 0);
    });

    retailer_form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (retailer_validateStep(retailer_currentStep)) {
            retailer_saveFormData();
            retailer_form.submit();
        }
    });

    // ===== INITIALIZATION =====
    retailer_loadFormData();
    retailer_showStep(retailer_currentStep);

    // Warn before leaving if form has data
    window.addEventListener('beforeunload', (e) => {
        const formData = new FormData(retailer_form);
        let hasData = false;
        for (let [key, value] of formData.entries()) {
            if (value) {
                hasData = true;
                break;
            }
        }
        if (hasData) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
})();

