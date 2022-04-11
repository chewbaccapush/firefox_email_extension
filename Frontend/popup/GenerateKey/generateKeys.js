window.onload = function() {
    let generateButton = document.getElementById('generateButton');
    let div = document.getElementById('alert');
    div.style.display = "none";

    generateButton.addEventListener('click', function() {
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;
        let name = document.getElementById('name').value;
        generateKey(email, password, name);
    });

};

//Generate key
async function generateKey(email, password, name) {
    console.log("generating...");
    console.log(email);
    console.log(password);

    const rawResponse = await fetch('http://localhost:3000/generateKey', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email: email, name: name, password: password})
      });
      const content = await rawResponse.json();

      let div = document.getElementById('alert');

      let storage = []; 
      if (localStorage.getItem(email) !== null) {
        storage = localStorage.getItem(email);
        storage = JSON.parse(storage);
        console.log(storage);
        storage.push(content.privateKey);
        console.log(storage);
        localStorage.setItem(email, JSON.stringify(storage));
      } else {
        storage[0] = content.privateKey;
        localStorage.setItem(email, JSON.stringify(storage));
      }
        
      div.style.display = "block";
}