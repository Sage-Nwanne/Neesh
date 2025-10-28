<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login - NEESH</title>
  <meta name="description" content="Log in to your NEESH account to manage your magazine titles and orders.">
  <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}?v={{ time() }}">
  <link rel="preconnect" href="https://fonts.bunny.net">
  <link href="https://fonts.bunny.net/css?family=manrope:400,500,600,700,800&display=swap" rel="stylesheet" />
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: "Manrope", sans-serif;
      background-color: #f5f5f5;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
    }

    .login-container {
      background: white;
      border-radius: 8px;
      padding: 60px 40px;
      max-width: 500px;
      width: 100%;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .logo-section {
      text-align: center;
      margin-bottom: 40px;
    }

    .logo-section img {
      max-width: 150px;
      height: auto;
    }

    .heading-section {
      text-align: center;
      margin-bottom: 40px;
    }

    .heading-section h1 {
      font-size: 32px;
      font-weight: 700;
      color: #000;
      margin-bottom: 10px;
    }

    .heading-section p {
      font-size: 14px;
      color: #666;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group input {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      font-size: 14px;
      font-family: "Manrope", sans-serif;
      background-color: #f9f9f9;
      transition: border-color 0.3s ease;
    }

    .form-group input:focus {
      outline: none;
      border-color: #000;
      background-color: #fff;
    }

    .form-group input::placeholder {
      color: #999;
    }

    .password-group {
      position: relative;
    }

    .password-toggle {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      background: none;
      border: none;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      color: #666;
      transition: color 0.3s ease;
    }

    .password-toggle:hover {
      color: #000;
    }

    .password-toggle svg {
      width: 20px;
      height: 20px;
    }

    .login-button {
      width: 100%;
      padding: 14px 16px;
      background-color: #000;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      font-weight: 600;
      font-family: "Manrope", sans-serif;
      cursor: pointer;
      margin-top: 10px;
      transition: background-color 0.3s ease;
    }

    .login-button:hover {
      background-color: #333;
    }

    .divider {
      display: flex;
      align-items: center;
      margin: 30px 0;
      color: #999;
      font-size: 14px;
    }

    .divider::before,
    .divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background-color: #e0e0e0;
    }

    .divider::before {
      margin-right: 15px;
    }

    .divider::after {
      margin-left: 15px;
    }

    .signup-section {
      text-align: center;
      margin-bottom: 20px;
    }

    .signup-section p {
      font-size: 14px;
      color: #666;
    }

    .signup-section a {
      color: #000;
      text-decoration: none;
      font-weight: 600;
      margin-left: 5px;
    }

    .signup-section a:hover {
      text-decoration: underline;
    }

    .support-section {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
    }

    .support-section p {
      font-size: 14px;
      color: #666;
    }

    .support-section a {
      color: #000;
      text-decoration: none;
      font-weight: 600;
      margin-left: 5px;
    }

    .support-section a:hover {
      text-decoration: underline;
    }

    @media (max-width: 600px) {
      .login-container {
        padding: 40px 20px;
      }

      .heading-section h1 {
        font-size: 24px;
      }
    }
  </style>
</head>

<body>
  <div class="login-container">
    <div class="logo-section">
      <img src="{{ asset('assets/image/Logo A1.png') }}" alt="NEESH Logo">
    </div>

    <div class="heading-section">
      <h1>Welcome Back</h1>
      <p>Log in to your account</p>
    </div>

    <form method="POST" action="{{ route('login') }}">
      @csrf
      <div class="form-group">
        <input type="email" name="email" placeholder="Email" required autofocus>
      </div>
      <div class="form-group password-group">
        <input type="password" id="password" name="password" placeholder="Password" required>
        <button type="button" class="password-toggle" id="passwordToggle" aria-label="Toggle password visibility">
          <svg id="eyeIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </button>
      </div>
      <button type="submit" class="login-button">Login</button>
    </form>

    <div class="divider">OR</div>

    <div class="signup-section">
      <p>New to Neesh? <a href="https://app.neesh.art/">Apply</a></p>
    </div>

    <div class="support-section">
      <p>Have any questions? <a href="mailto:hi@neesh.art">Talk to the team</a></p>
    </div>

    <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e0e0e0; margin-top: 20px;">
      <p style="font-size: 14px; color: #666;">
        <a href="https://neesh.art" style="color: #000; text-decoration: none; font-weight: 600;">← Back to Neesh</a>
      </p>
    </div>
  </div>

  <script>
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('passwordToggle');
    const eyeIcon = document.getElementById('eyeIcon');

    passwordToggle.addEventListener('click', (e) => {
      e.preventDefault();

      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        // Change to eye-off icon
        eyeIcon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
      } else {
        passwordInput.type = 'password';
        // Change back to eye icon
        eyeIcon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
      }
    });
  </script>
</body>

</html>
