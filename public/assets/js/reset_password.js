 (function () {
      const reset_form = document.getElementById('reset_resetForm');
      const reset_password = document.getElementById('reset_password');
      const reset_confirmPassword = document.getElementById('reset_confirmPassword');

      const reset_group_password = document.getElementById('reset_group_password');
      const reset_group_confirm = document.getElementById('reset_group_confirm');

      const reset_submitBtn = document.getElementById('reset_submitBtn');

      const reset_urlParams = new URLSearchParams(window.location.search);
      const reset_userEmail = reset_urlParams.get('email');

      const reset_updatePassword = window.reset_updatePassword || window.updatePassword || function (email, newPass) {
        console.warn('No updatePassword handler found on window. Called with', email, newPass);
      };

      function reset_clearErrors() {
        reset_group_password.classList.remove('reset-error');
        reset_group_confirm.classList.remove('reset-error');
      }

      reset_form.addEventListener('submit', function (reset_e) {
        reset_e.preventDefault();
        let reset_valid = true;

        reset_clearErrors();

        if (!reset_password.value || reset_password.value.trim().length < 6) {
          reset_group_password.classList.add('reset-error');
          reset_valid = false;
          reset_password.focus();
        }

        if (reset_password.value !== reset_confirmPassword.value) {
          reset_group_confirm.classList.add('reset-error');
          reset_valid = false;
          if (!document.querySelector('.reset-form-group.reset-error input:focus')) {
            reset_confirmPassword.focus();
          }
        }

        if (reset_valid) {
          try {
            reset_updatePassword(reset_userEmail, reset_password.value);
          } catch (err) {
            console.error('reset_updatePassword error:', err);
          }

          window.location.href = "registration.html";
        }
      });

      reset_password.addEventListener('input', function () {
        if (this.value.trim().length >= 6) {
          reset_group_password.classList.remove('reset-error');
        }
      });
      reset_confirmPassword.addEventListener('input', function () {
        if (this.value === reset_password.value) {
          reset_group_confirm.classList.remove('reset-error');
        }
      });


      document.querySelectorAll('.reset-eye-toggle').forEach(icon => {
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