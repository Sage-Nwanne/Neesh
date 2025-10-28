window.addEventListener("load", () => {
    const startpagelogo = document.querySelector(".start-logo-center");
    const startpagetext = document.querySelector(".start-text");
    const startpagebutton = document.querySelector(".start-button");

    // Show all elements immediately without animation
    if (startpagelogo) startpagelogo.classList.add("startpage_logoshow");
    if (startpagetext) startpagetext.classList.add("startpage_textshow");
    if (startpagebutton) startpagebutton.classList.add("startpage_buttonshow");
});