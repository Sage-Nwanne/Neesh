<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Publisher and Retailer</title>
  <link rel="stylesheet" href="assets/css/style.css">
  <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}">

</head>

<body>
  <div class="logo-image">
        <img src="{{asset('assets/image/Logo A1.png')}}" alt="Logo Image">
  </div>

  <div class="new_to_nessh_innerwhole_container">
    <a href="{{ url()->previous() }}" class="new_to_nessh_back_arrow">
            <img src="{{asset('assets/image/left arrow.png')}}" alt="Back Arrow">
    </a>
    <div class="new_to_nessh_container">
      <div class="heading_and_description_container">
        <h1 class="new_to_nessh_heading">
          New to Neesh?
        </h1>
        <p class="new_to_nessh_description">
          Apply to join our curated network. Choose your role to get started
        </p>
      </div>

      <div class="publisher_and_retailer_conatiner">
        <div class="applying_publisher_and_retailer">
          <a href="{{route('register.publisher')}}" class="image_and_text_container">
            <div class="image_container">
              <img src="{{asset('assets/image/book.png')}}" alt="Book">
            </div>
            <div class="text_container">
              <h2>Apply as a Publisher</h2>
            </div>
          </a>
          <a href="{{route('register.retailer')}}" class="image_and_text_container">
            <div class="image_container">
            <img src="{{asset('assets/image/house.png')}}" alt="Book">

            </div>
            <div class="text_container">
              <h2>Apply as a Retailer</h2>
            </div>
          </a>
        </div>
         <div class="or-divider_login">
    <span>OR</span>
  </div>
        <div class="or_container">
        <div class="log_in_container">
          <p class="log_in_text">Already found your Neesh?</p>
          <a href="{{route('login')}}" class="log_in">
            <p>Log in</p>
            <div class="log_in_navigation_arrow">
            <img src="{{asset('assets/image/right arrow.png')}}" alt="Book">

            </div>
          </a>
        </div>


        <div class="talking_with_team_container">
          <div class="only_border"></div>
          <div class="talking_with_team_inner">
            <p>Have any questions?</p>
            <a href="#" class="team_call_and_image">
              <h3>
                Talk to the team
              </h3>
              <div class="team_call_navigation_arrow">
             <img src="{{asset('assets/image/right arrow.png')}}" alt="Book">
                
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>

</html>