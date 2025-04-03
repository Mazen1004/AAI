import base64

#encodes image to base 64
def encodeImage(imgPath):
    with open(imgPath, "rb") as imgFile:
        return base64.b64encode(imgFile.read()).decode("utf-8")