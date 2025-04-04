# main.py

# to run file notes:
# step 1: cd into aai file path
# step 2: venv\Scripts\activate  (to activate virtual environment)
# step 3: python -m identifyArtifacts.main (to run our main file)

from flask import Flask, request, jsonify
from flask_cors import CORS
from identifyArtifacts import IdentifyArtifacts

app = Flask(__name__)
CORS(app, origins=["http://localhost:8081"])

@app.route('/process', methods=['POST'])
def process_request():
    # Initialize artifact identifier
    artifact_identifier = IdentifyArtifacts()

    # Check if the incoming request has the image file
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        # Pass the file directly to IdentifyArtifacts for processing
        description = artifact_identifier.analyze_artifact(file)  # Send the raw file

        # Return the description of the artifact
        return jsonify({"description": description}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
