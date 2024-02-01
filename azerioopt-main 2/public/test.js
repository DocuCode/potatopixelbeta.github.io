function sinscrire() {

    const nameInput = document.getElementById('inputPseudo');
    const passwordInput = document.getElementById('inputPassword');
    const emailInput = document.getElementById('inputEmail');

    const name = nameInput.value;
    const password = passwordInput.value;
    const email = emailInput.value;


    console.log(name);
    console.log(password);
    console.log(email);
    console.log("Miaou");
    const response = fetch('http://localhost:4000/api/setAccount', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, password, email })
    });

}

