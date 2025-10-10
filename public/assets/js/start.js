window.addEventListener("load", () => {
    const startpagelogo = document.querySelector(".start-logo-center");
    const startpagetext = document.querySelector(".start-text");
    const startpagebutton = document.querySelector(".start-button");

    setTimeout(() => {
      startpagelogo.classList.add("startpage_logoshow");
    }, 1000);

    setTimeout(() => {
      startpagetext.classList.add("startpage_textshow");
    }, 1800);

    setTimeout(() => {
      startpagetext.classList.remove("startpage_textshow");
      startpagetext.classList.add("startpage_textfadeout");
    }, 3000);

    setTimeout(() => {
      startpagetext.classList.add("startpage_texthide");
    }, 4000);

    setTimeout(() => {
      startpagebutton.classList.add("startpage_buttonshow");
    }, 4400);
  });