# main.py

# to run file notes:
# step 1: cd into aai file path
# step 2: venv\Scripts\activate  (to activate virtual environment)
# step 3: python -m identifyArtifacts.main (to run our main file)

from identifyArtifacts.identifyArtifacts import IdentifyArtifacts

def main():
    artifact_identifier = IdentifyArtifacts()
    description = artifact_identifier.analyze_artifact()
    print("Artifact Description:")
    print(description)

if __name__ == "__main__":

    main()
