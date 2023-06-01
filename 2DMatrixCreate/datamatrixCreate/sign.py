from ecdsa import SigningKey
import hashlib
import base64
import sys

message=base64.b64decode(sys.argv[1])

key=sys.argv[2]
sk = SigningKey.from_pem(key)
sig = sk.sign(message, hashfunc=hashlib.sha256)
signature = base64.b32encode(sig)

print(signature.decode("utf8"))