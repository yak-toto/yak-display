import json

from yak_server import create_app

app = create_app()

print(json.dumps(app.openapi(), separators=(",", ":")))
