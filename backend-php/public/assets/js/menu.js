document.addEventListener("DOMContentLoaded", function() {
  const menuToggle = document.getElementById("menuToggle");
  const sideMenu   = document.getElementById("sideMenu");
  const closeMenu  = document.getElementById("closeMenu");

  menuToggle.onclick = function() {
    if (window.innerWidth >= 1024) {
      sideMenu.style.maxWidth = "85%";
      sideMenu.style.width = "100%";
      menuToggle.style.display = "none";
      sideMenu.style.setProperty("z-index", "1000", "important");
    } else {
      sideMenu.style.width = "250px";
      sideMenu.style.maxWidth = "250px";
    }
  };

  closeMenu.onclick = function() {
    if (window.innerWidth >= 1024) {
      sideMenu.style.width = "0";
      menuToggle.style.display = "block";
    } else {
      sideMenu.style.width = "0";
       menuToggle.style.display = "block";
    }
  };
});




