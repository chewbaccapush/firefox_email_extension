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


const privateKeyRecipient = "-----BEGIN PGP PRIVATE KEY BLOCK-----\n" +
    "\n" +
    "xYYEYlFpQhYJKwYBBAHaRw8BAQdAAckpcsYNv0PtZGXlSDxHKCgGR6fMxQ7U\n" +
    "hmXdFWiT2l3+CQMIpv6rbC322A7gDI4qNSR653iJl+jo0X4qaSKvkf6Jo4CU\n" +
    "mS3MHBAqH4nsvfGvXT/rUvyp9XMBl0SckptNkkMqZJck8BlGmoTY3Pv7mG/f\n" +
    "w80jRmljbyBUZXN0IDxnYXNwZXIubHVrYWNzQGdtYWlsLmNvbT7CjAQQFgoA\n" +
    "HQUCYlFpQgQLCQcIAxUICgQWAAIBAhkBAhsDAh4BACEJEAU9zuPqrEipFiEE\n" +
    "7+SgFCuKOMoeIbuFBT3O4+qsSKmPggD7BKB8fG0sqjoBLoq6kp2hLf95ZhJw\n" +
    "eogOylaDek490bEBAKxO5DpaLZoP/ukWSJnKWvwnndr7jq2d1AfXSHarnecK\n" +
    "x4sEYlFpQhIKKwYBBAGXVQEFAQEHQE3iTs1L4s7YvlbVTk8+Bfh7Ivl+jfET\n" +
    "I7KGhGf3aYc6AwEIB/4JAwji77rV2agDweAhRt/dgpXhyv2OTOsqOe+Mh3NB\n" +
    "zCbUZqLXfLW4DC2lPWF/aiDCrFBA9YNroBuH5MMp1O4CuTku/P9Si6KMLC8R\n" +
    "YBIQiqFQwngEGBYIAAkFAmJRaUICGwwAIQkQBT3O4+qsSKkWIQTv5KAUK4o4\n" +
    "yh4hu4UFPc7j6qxIqfkvAQCWPHvPYI8XEOgTygd1jg+lXd51GbxExSP0YCa/\n" +
    "S9bHKAD/fddVBu2S8mNi+bjhjcjHnuRLgk+XP023HJ2XcqEDZAg=\n" +
    "=JWLk\n" +
    "-----END PGP PRIVATE KEY BLOCK-----\n"

const privateKeySender = "-----BEGIN PGP PRIVATE KEY BLOCK-----\n" +
    "\n" +
    "xYYEYlFrJhYJKwYBBAHaRw8BAQdAKUSZv3i66/pdYCezNrBTW0Yt0gXqmARA\n" +
    "dAB1r/JTh2P+CQMIIy+d7CAmyuDg6yFGdhxSviZold9mRVrMA8HlgRggLL2n\n" +
    "FmGFA+JnWWjC+NmMcOzH/BVIbEThOZ9SPQsAcrQR/KkyrZpFp4CakKtItRN3\n" +
    "Cs0lVmluY2ljIFRlc3QgPHNhc2EudmluY2ljMTZAZ21haWwuY29tPsKMBBAW\n" +
    "CgAdBQJiUWsmBAsJBwgDFQgKBBYAAgECGQECGwMCHgEAIQkQW9/nPg97m4YW\n" +
    "IQS94bTYNlnISlZ5itpb3+c+D3ubhpaeAP9rS8G+dOumaSbQhUWceH4Y0TM8\n" +
    "PAgKQI+DY93GqVNGNQEAruD4AC+DsvAZdASZr9D7OU9dMBouyo0l7re8lGtU\n" +
    "zAzHiwRiUWsmEgorBgEEAZdVAQUBAQdAEu3Nx3WWxXqk1NrlEosmyq0awqZ8\n" +
    "zs6K/InExVaBOkADAQgH/gkDCElS4DZgRr5m4IQP/cs6u8IISfwpZ6S96d0+\n" +
    "URUrAl8PrLjN4umc0cF1lC7UzEph4QP1rRFry2oGcvl/KZIThRi/puxX/7In\n" +
    "s0MtEIf0H+/CeAQYFggACQUCYlFrJgIbDAAhCRBb3+c+D3ubhhYhBL3htNg2\n" +
    "WchKVnmK2lvf5z4Pe5uGw+wBALvtbjQTM7s8LUwFKaREg66cAJyr52wEx/yc\n" +
    "QgPiU6Y5AP9PlXCI4JXGgJz4UckNZWyFEByw0kZWtDCB5QT/i4vuAg==\n" +
    "=t7uQ\n" +
    "-----END PGP PRIVATE KEY BLOCK-----\n"

    app.use(bodyParser.json())

app.post("/generateKey", async (req, res) => {
     
     // dobis iz vmesnika
     const {email} = req.body;
     const {name} = req.body;
     const {password} = req.body;
 
     // generiranje ključev
     const { privateKey, publicKey, revocationCertificate } = await openpgp.generateKey({
         type: 'ecc', // Type of the key, defaults to ECC
         curve: 'curve25519', // ECC curve name, defaults to curve25519
         userIDs: [{ name: name, email: email }], // you can pass multiple user IDs
         passphrase: password, // protects the private key
         format: 'armored' // output key format, defaults to 'armored' (other options: 'binary' or 'object')
     });
 
     console.log(privateKey);
     console.log(publicKey);
     console.log(email);
     let response = {privateKey: privateKey};
     console.log(req.body);
 
     // shranjevanje public keya na server
     axios.post("https://keys.openpgp.org/vks/v1/upload", { keytext: publicKey })
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
 
       
    /*
    // dobis iz vmesnika
    let email = request.params.email
    let name = 'Vincic Test'
    let password = 'test1234'

    // generiranje ključev
    const { privateKey, publicKey, revocationCertificate } = await openpgp.generateKey({
        type: 'ecc', // Type of the key, defaults to ECC
        curve: 'curve25519', // ECC curve name, defaults to curve25519
        userIDs: [{ name: name, email: email }], // you can pass multiple user IDs
        passphrase: password, // protects the private key
        format: 'armored' // output key format, defaults to 'armored' (other options: 'binary' or 'object')
    });

    console.log(privateKey);     // '-----BEGIN PGP PRIVATE KEY BLOCK ... '
    console.log(publicKey);      // '-----BEGIN PGP PUBLIC KEY BLOCK ... '
    console.log(revocationCertificate); // '-----BEGIN PGP PUBLIC KEY BLOCK ... '

    // shranjevanje public keya na server
    await axios.post("https://keys.openpgp.org/vks/v1/upload", {
            keytext: publicKey
        })
        .then(res1 => {
            console.log("axios1:", res1.data)
            let token = res1.data.token
            axios.post("https://keys.openpgp.org/vks/v1/request-verify", {
                token: token,
                addresses: [email]
            })
                .then(res2 => {
                    console.log("axios2:", res2.data)
                })
                .catch(err => {
                    console.log(err)
                })
        })
        .catch(err => {
            console.log(err)
        })
        .finally(() => {
            // response.send('res')
        }).data

    console.log(token);
    */
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
    let {recipient} = req.body;
    let {message} = req.body;
    let {senderPrivateKey} = req.body;
    let {passphrase} = req.body;
    //dobimo public key prejemnika
    let encrypted;
    axios.get('https://keys.openpgp.org/vks/v1/by-email/' + encodeURIComponent(recipient))
        .then(async (opnepgpResponse) => {
            let recipientPublicKey = opnepgpResponse.data;
            encrypted = await encrypt(recipientPublicKey, message, senderPrivateKey, passphrase)
        })
        .catch((err) => {
            response.status('400').send(err);
        })
    response.status('200').send(encrypted);
})

app.get('/decrypt', async (request, response) => {
    decrypt();
    response.send('res')
})

async function encrypt(recipientPublicKey, message, senderPrivateKey, passphrase) {

    // Private key za podpisaovanje
    const privateKey = await openpgp.decryptKey({
        privateKey: await openpgp.readPrivateKey({ armoredKey: senderPrivateKey }),
        passphrase: passphrase
    });

    // Public key prejemnika pretvorio v object
    const publicKey = await openpgp.readKey({ armoredKey: recipientPublicKey });

    // Kriptira
    const encrypted = await openpgp.encrypt({
        message: await openpgp.createMessage({ text: message }), // input as Message object
        encryptionKeys: publicKey,
        signingKeys: privateKey // optional
    });
    console.log(encrypted);
    return encrypted;
}

async function decrypt() {
    let encryptedMessage = "-----BEGIN PGP MESSAGE-----\n" +
        "\n" +
        "wV4DIsOE4y1IZi8SAQdA4oG65C48YD8s4Xz2MsOwXEuWrGPrVe+I8F9hBR9J\n" +
        "2TcwoLt8/BAnHFIvo6Xk5+z6xYhUduDgGSbcLHE+Zj6Ux7OUQLlbn+8VMs8B\n" +
        "VSiAZwrI0sAEAUqrgkrplc3r/Q76u6zkKHnV+idtKiF2n5SYidWTOO5OWLEN\n" +
        "Bp0j7EXYDKx9WMIydvfgT1gFByYIea9pajNvNJds3wiJeQW4QruXJqoYPU3+\n" +
        "KLc9qyVcZHcxC9Q9gSXzvm5JH2yUBqt4B5w9qT/Ud5VjTgW5LZi/lCCYljJx\n" +
        "oje3tltdn7E7NnVSdIhGivRbGvq1c/xJdz0me3fH69Su57jxhxaGQVM7gCgw\n" +
        "glNa+t7N39lZXE6QJvAF9/0izoa2NYtO6A==\n" +
        "=1YTX\n" +
        "-----END PGP MESSAGE-----"

    // pretvori sporocilo v objekt
    let message = await openpgp.readMessage({
        armoredMessage: encryptedMessage // parse armored message
    });

    // pretvori private key v objekt
    const privateKey = await openpgp.decryptKey({
        privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyRecipient }),
        passphrase: 'test1234'
    });

    // Za verificiranje podpisa
    let armoredKey = '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
        'Comment: BDE1 B4D8 3659 C84A 5679  8ADA 5BDF E73E 0F7B 9B86\n' +
        'Comment: Vincic Test <sasa.vincic16@gmail.com>\n' +
        '\n' +
        'xjMEYlFrJhYJKwYBBAHaRw8BAQdAKUSZv3i66/pdYCezNrBTW0Yt0gXqmARAdAB1\n' +
        'r/JTh2PNJVZpbmNpYyBUZXN0IDxzYXNhLnZpbmNpYzE2QGdtYWlsLmNvbT7CjAQQ\n' +
        'FgoAHQUCYlFrJgQLCQcIAxUICgQWAAIBAhkBAhsDAh4BACEJEFvf5z4Pe5uGFiEE\n' +
        'veG02DZZyEpWeYraW9/nPg97m4aWngD/a0vBvnTrpmkm0IVFnHh+GNEzPDwICkCP\n' +
        'g2PdxqlTRjUBAK7g+AAvg7LwGXQEma/Q+zlPXTAaLsqNJe63vJRrVMwMzjgEYlFr\n' +
        'JhIKKwYBBAGXVQEFAQEHQBLtzcd1lsV6pNTa5RKLJsqtGsKmfM7OivyJxMVWgTpA\n' +
        'AwEIB8J4BBgWCAAJBQJiUWsmAhsMACEJEFvf5z4Pe5uGFiEEveG02DZZyEpWeYra\n' +
        'W9/nPg97m4bD7AEAu+1uNBMzuzwtTAUppESDrpwAnKvnbATH/JxCA+JTpjkA/0+V\n' +
        'cIjglcaAnPhRyQ1lbIUQHLDSRla0MIHlBP+Li+4C\n' +
        '=kTJk\n' +
        '-----END PGP PUBLIC KEY BLOCK-----'

    console.log(armoredKey)

    // public key posiljatelja (za verificireanje)
    const publicKey = await openpgp.readKey({ armoredKey:  armoredKey });

    // dekriptiranje
    const { data: decrypted, signatures } = await openpgp.decrypt({
        message,
        verificationKeys: publicKey, // optional
        decryptionKeys: privateKey
    });
    console.log(decrypted)

    // preveri skladnost podpisa
    try {
        await signatures[0].verified; // throws on invalid signature
        console.log('Signature is valid');
    } catch (e) {
        throw new Error('Signature could not be verified: ' + e.message);
    }
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