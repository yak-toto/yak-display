import json

from yak_server import create_app
from yak_server.v1.routers.version import extract_metadata

app = create_app()

version, schema_hash = extract_metadata(app)

print(schema_hash)
