from flask import Flask

# port : http://127.0.0.1:5000

app = Flask(__name__)

@app.route('/generatePublicKey', methods=['GET'])
def generatePublicKey():
    return 'generating..'

@app.route('/generatePrivateKey', methods=['GET'])
def generatePrivateKey():
    return 'generating..'

@app.route('/encrypt', methods=['POST'])
def encrypt():
    return 'encrypting..'


@app.route('/decrypt', methods=['POST'])
def decrypt():
    return 'decrypting..'





if __name__ == '__main__':
    app.run()
