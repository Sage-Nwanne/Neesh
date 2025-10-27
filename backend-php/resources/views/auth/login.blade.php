<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login - NEESH</title>
  <meta name="description" content="Log in to your NEESH account to manage your magazine titles and orders.">
  <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
  <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}">
  <style>
    .btn {
            padding: 10px 18px;
            border-radius: 6px;
            border: 0;
            cursor: pointer;
            font-weight: 600;
        }

        .btn-back {
            background: #eee;
            color: #222;
        }

        .btn-next {
            background: #222;
            color: #fff;
        }
  </style>
</head>

<body>
  <div class="logo-image">
    <img src="{{ asset('assets/image/Logo A1.png') }}" alt="Logo Image">
  </div>

  <div class="new_to_nessh_innerwhole_container">
    <a href="{{ url()->previous() }}" class="new_to_nessh_back_arrow">
      <img src="{{ asset('assets/image/left arrow.png') }}" alt="Back Arrow">
    </a>
    <div class="new_to_nessh_container">
      <div class="heading_and_description_container">
        <h1 class="new_to_nessh_heading">
          Welcome Back
        </h1>
        <p class="new_to_nessh_description">
          Log in to your account
        </p>
      </div>

      <div class="publisher_and_retailer_conatiner">
        <form method="POST" action="{{ route('login') }}">
          @csrf
          <div class="name_and_password_inputs">
            <div class="email_container">
              <input type="email" name="email" placeholder="Email" class="input_innerclass" required autofocus>
            </div>
            <div class="password_container">
              <input type="password" name="password" placeholder="Password" class="input_innerclass" required>
            </div>
          </div>
          <div style="display:flex; justify-content:flex-end; margin-top:10px; margin-bottom:20px;">
          <button type="submit" class="btn btn-next" id="nextBtn">Login</button>


          </div>
        </form>

        <div class="or-divider_login">
          <span>OR</span>
        </div>

        <div class="log_in_container">
          <p class="log_in_text">New to Neesh?</p>
          <a href="{{ route('home') }}" class="log_in">
            <p>Apply</p>
            <div class="log_in_navigation_arrow">
              <img src="{{ asset('assets/image/right arrow.png') }}" alt="Right Navigation Arrow">
            </div>
          </a>
        </div>

        <div class="talking_with_team_container">
          <div class="only_border"></div>
          <div class="talking_with_team_inner">
            <p>Have any questions?</p>
            <a href="#" class="team_call_and_image">
              <h3>Talk to the team</h3>
              <div class="team_call_navigation_arrow">
                <img src="{{ asset('assets/image/right arrow.png') }}" alt="Right Navigation Arrow">
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>

</html>
