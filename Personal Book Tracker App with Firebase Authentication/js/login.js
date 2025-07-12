document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");
  const emailInput = document.getElementById("login-email");
  const passwordInput = document.getElementById("login-password");
  const errorMessage = document.getElementById("login-error");

  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Basic validation
    if (!email || !password) {
      showError("Please fill in all fields");
      return;
    }

    // Show loading state
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = "Logging in...";
    submitBtn.disabled = true;

    // Attempt login
    const result = await AuthService.login(email, password);

    if (result.success) {
      // Login successful - redirect handled by auth state change
    } else {
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
