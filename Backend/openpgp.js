const openpgp = require('openpgp')
const express = require('express')
const axios = require('axios')
const http = require('http');
const app = express()
const port = 3000;
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(
    cors({
        origin: "*",
    })
);

app.use(bodyParser.json())

app.post("/generateKey", async (req, res) => {

    // dobis iz vmesnika
    const {email} = req.body;
    const {name} = req.body;
    const {password} = req.body;

    // generiranje ključev
    const {privateKey, publicKey, revocationCertificate} = await openpgp.generateKey({
        type: 'ecc', // Type of the key, defaults to ECC
        curve: 'curve25519', // ECC curve name, defaults to curve25519
        userIDs: [{name: name, email: email}], // you can pass multiple user IDs
        passphrase: password, // protects the private key
        format: 'armored' // output key format, defaults to 'armored' (other options: 'binary' or 'object')
    });

    console.log(privateKey);
    console.log(publicKey);
    console.log(email);
    let response = {privateKey: privateKey};
    console.log(req.body);

    // shranjevanje public keya na server
    axios.post("https://keys.openpgp.org/vks/v1/upload", {keytext: publicKey})
        .then(res1 => {
            let token = res1.data.token;
            axios.post("https://keys.openpgp.org/vks/v1/request-verify", {
                token: token,
                addresses: [email]
            })
                .then(res2 => {
                    res.status(200).json(response);
                })
                .catch(err => {
                    res.send(err);
                })
        })
        .catch(err => {
            res.status(403).send(err);
        })
})

// dobi ključ po email naslovu
app.get('/getKey/:email', async (request, response) => {
    axios.get('https://keys.openpgp.org/vks/v1/by-email/' + encodeURIComponent(request.params.email))
        .then((res) => {
            console.log(res.data)
        })
        .catch((err) => {
            console.log(err)
        })
    response.send('res')
})

// enkripcija
app.post('/encrypt', async (request, response) => {
    let {recipient} = request.body;
    let {message} = request.body;
    let {senderPrivateKey} = request.body;
    let {passphrase} = request.body;

    // dobimo public key prejemnika
    let encrypted;
    axios.get('https://keys.openpgp.org/vks/v1/by-email/' + encodeURIComponent(recipient))
        .then(async (opnepgpResponse) => {
            let recipientPublicKey = opnepgpResponse.data;
            encrypted = await encrypt(recipientPublicKey, message, senderPrivateKey, passphrase)
            response.status('200').json({encrypted: encrypted});
        })
        .catch((err) => {
            response.status('400').send(err);
        })
})

// dekripcija
app.post('/decrypt', async (req, response) => {
    let {message} = req.body;
    let {recipientPrivateKey} = req.body;
    let {senderEmail} = req.body;
    let {passphrase} = req.body;
    console.log(senderEmail);

    // poišče javni ključ v bazi


        let senderPublicKey = await axios.get('https://keys.openpgp.org/vks/v1/by-email/' + encodeURIComponent(senderEmail))

    console.log(senderPublicKey.data)

    try {
        let decrypted = await decrypt(message, recipientPrivateKey, senderPublicKey.data, passphrase);
        console.log(decrypted)
        response.json(decrypted)
    } catch (e) {
        console.log("Decryption error: ", e.message)
        response.status(400).send(e.message)
    }
    //decrypt();
})

async function encrypt(recipientPublicKey, message, senderPrivateKey, passphrase) {
    // Private key za podpisaovanje
    const privateKey = await openpgp.decryptKey({
        privateKey: await openpgp.readPrivateKey({armoredKey: senderPrivateKey}),
        passphrase: passphrase
    });

    // Public key prejemnika pretvorio v object
    const publicKey = await openpgp.readKey({armoredKey: recipientPublicKey});

    // Kriptira
    const encrypted = await openpgp.encrypt({
        message: await openpgp.createMessage({text: message}), // input as Message object
        encryptionKeys: publicKey,
        signingKeys: privateKey // optional
    });
    return encrypted;
}

async function decrypt(data, recipientPrivateKey, senderPublicKey, pass) {

    // pretvori sporocilo v objekt
    let message = await openpgp.readMessage({
        armoredMessage: data // parse armored message
    });

    // pretvori private key v objekt
    const privateKey = await openpgp.decryptKey({
        privateKey: await openpgp.readPrivateKey({armoredKey: recipientPrivateKey}),
        passphrase: pass
    });

    // Za verificiranje podpisa

    const publicKey = await openpgp.readKey({armoredKey: senderPublicKey});
    // dekriptiranje
    const {data: decrypted, signatures} = await openpgp.decrypt({
        message,
        verificationKeys: publicKey, // optional
        decryptionKeys: privateKey
    });

    /*let signer = await axios.get('https://keys.openpgp.org/vks/v1/by-email/' + )*/
    let valid = true;
    // preveri skladnost podpisa
    try {
        await signatures[0].verified; // throws on invalid signature
        console.log('Signature is valid');
    } catch (e) {
        valid = false
        throw new Error('Signature could not be verified: ' + e.message);
    }
    return {decrypted: decrypted, valid: valid};
}

async function getPublicKey(email) {
    axios.get('https://keys.openpgp.org/vks/v1/by-email/' + encodeURIComponent(email))
        .then(async (res) => {
            /*console.log('getKey: ', res.data)*/
            return res.data
        })
        .catch((err) => {
            console.log("err")
        })
}

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})