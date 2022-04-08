from flask import *

# port : http://127.0.0.1:5000
import Controller

app = Flask(__name__)

@app.route('/generateKeys', methods=['POST'])
def generateKeys():
    content = request.json
    print(content['email'])
    Controller.generateKeys(content['email'], content['password'])

    return 'generating..'


@app.route('/encrypt', methods=['POST'])
def encrypt():
    return 'encrypting..'


@app.route('/decrypt', methods=['POST'])
def decrypt():
    return 'decrypting..'





if __name__ == '__main__':
    app.run()
