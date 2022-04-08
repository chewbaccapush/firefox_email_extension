import rsa
from playhouse.db_url import connect
from rsa import *
from peewee import *
import os

# db = MySQLDatabase('mailencrypt', host='localhost', port=3306, user='root', password='root')
db = MySQLDatabase('FireFoxExtension', host='35.197.197.118', port=3306, user='root', password='root')

class User(Model):
    id = AutoField()
    email = TextField()
    password = TextField()
    publicKey = TextField()
    class Meta:
        database = db
        dbTable = 'User'

User.create_table()

def generateKeys(email, password):
    print("Generating keys")
    publicKey, privateKey = rsa.newkeys(1024)
    print("Saving to database")
    User(email=email, password=password, publicKey=publicKey.save_pkcs1(format='PEM')).save()
    return privateKey