from flask import Flask, request, jsonify

app = Flask(__name__)

# Sample endpoint to handle search queries
@app.route('/api/search', methods=['POST'])
def search():
    data = request.json
    query = data.get('query', '')

    # Simple response for testing
    response = {
        'message': f'Search received for: {query}',
        'result': 'This is a test response from the backend!'
    }
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
