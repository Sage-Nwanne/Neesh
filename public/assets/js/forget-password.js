const forgot_emailInput = document.getElementById('forgot_email');
    const forgot_navigateBtn = document.getElementById('forgot_navigateBtn');
    const forgot_emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

    forgot_emailInput.addEventListener("input", () => {
      if (forgot_emailPattern.test(forgot_emailInput.value.trim())) {
        forgot_navigateBtn.classList.add("forgot_active");
        localStorage.setItem("forgot_resetEmail", forgot_emailInput.value.trim());
      } else {
        forgot_navigateBtn.classList.remove("forgot_active");
      }
    });