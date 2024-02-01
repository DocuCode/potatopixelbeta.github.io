// Background custom by me from pen https://codepen.io/Mamboleoo/pen/BxMQYQ

const password = document.getElementById('password');
    const toggleShowHide = document.querySelector('.show-hide-toggle');

    function showHide() {
      if (password.type === 'password') {
        password.setAttribute('type', 'text');
        toggleShowHide.innerHTML = "Hide"
      } else {
        password.setAttribute('type', 'password');
        toggleShowHide.innerHTML = "Show"
      }
    }