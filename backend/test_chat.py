import requests
import json
import sseclient

def test_chat():
    url = "http://localhost:8000/chat"
    payload = {
        "messages": [
            {"role": "user", "content": "Book a meeting tomorrow at 3pm."}
        ]
    }
    headers = {
        "Content-Type": "application/json"
    }

    response = requests.post(url, json=payload, headers=headers, stream=True)

    client = sseclient.SSEClient(response)
    print("Agent Response:", end=" ", flush=True)
    for event in client.events():
        if event.data == "[DONE]":
            break
        try:
            data = json.loads(event.data)
            if "content" in data:
                print(data["content"], end="", flush=True)
        except json.JSONDecodeError:
            print("Error parsing SSE data:", event.data)
    print("\n")

    # Test second message
    payload["messages"].append({"role": "assistant", "content": "Got the date! What time works for you?"})
    payload["messages"].append({"role": "user", "content": "3:00 PM"})
    response = requests.post(url, json=payload, headers=headers, stream=True)

    client = sseclient.SSEClient(response)
    print("Agent Response 2:", end=" ", flush=True)
    for event in client.events():
        if event.data == "[DONE]":
            break
        try:
            data = json.loads(event.data)
            if "content" in data:
                print(data["content"], end="", flush=True)
        except json.JSONDecodeError:
            print("Error parsing SSE data:", event.data)
    print("\n")


if __name__ == "__main__":
    test_chat()
