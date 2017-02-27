from flask import Flask

app = Flask(__name__)

def add_cors_header(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, PATCH, DELETE, OPTIONS'
    return response

app.after_request(add_cors_header)

# Flask secret key
app.config.from_object('settings')

# Elasticsearch settings
ES_SETTINGS = {
    'ES_CLUSTER': 'http://subsidies-elasticsearch:9200',
    'ES_INDEX': 'sub',
    'ES_TYPE': 'item',
}
