window.onload = function() {
    let generateButton = document.getElementById('generateButton');
   
 
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

    // generiranje ključev
    fetch("https://europe-west3-firefoxextension.cloudfunctions.net/generateKeys",
    {
        method: "POST",
        body: JSON.stringify({email: email, name: name, password: password})
    })
    .then((res) => {
        console.log(res.text());
        console.log(res.data);
        
    })
    .catch((e) => {console.log(e)})
}