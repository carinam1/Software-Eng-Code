import json
import requests
from flask import Flask, request, jsonify

app = Flask(__name__, static_url_path='')
API_KEY = "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"

@app.route('/chatbot', methods=['POST'])
def chatbot():
    data = request.get_json()
    prompt = data['message']

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}",
    }

    body = {
        "model": "text-davinci-002",
        "prompt": f"{prompt}\n",
        "temperature": 0.7,
        "max_tokens": 150,
        "top_p": 1,
        "frequency_penalty": 0,
        "presence_penalty": 0,
    }

    response = requests.post("https://api.openai.com/v1/engines/davinci-codex/completions", headers=headers, json=body)
    response_text = response.json()["choices"][0]["text"].strip()
    return jsonify({"response": response_text})


if __name__ == '__main__':
    app.run()
