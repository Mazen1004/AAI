from abc import ABC, abstractmethod

class AIService(ABC):
    @abstractmethod
    def get_artifact_description(self) -> str:
        """
        Given a prompt (which may include base64-encoded image data and additional text),
        returns a text description of the artifact.
        """
        pass