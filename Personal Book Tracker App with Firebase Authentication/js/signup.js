document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.getElementById("signup-form");
  const emailInput = document.getElementById("signup-email");
  const passwordInput = document.getElementById("signup-password");
  const confirmPasswordInput = document.getElementById(
    "signup-confirm-password"
  );
  const errorMessage = document.getElementById("signup-error");

  signupForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Validation
    if (!email || !password || !confirmPassword) {
      showError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      showError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      showError("Password should be at least 6 characters");
      return;
    }

    // Show loading state
    const submitBtn = signupForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = "Creating account...";
    submitBtn.disabled = true;

    // Attempt signup
    const result = await AuthService.signup(email, password);

    if (!result.success) {
      showError(result.error);
    }

    // Reset button state
    submitBtn.textContent = originalBtnText;
    submitBtn.disabled = false;
  });

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";

    // Hide error after 5 seconds
    setTimeout(() => {
      errorMessage.style.display = "none";
    }, 5000);
  }
});
