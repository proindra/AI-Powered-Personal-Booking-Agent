import json
from fastapi.testclient import TestClient
from main import app

def test_chat():
    client = TestClient(app)

    payload = {
        "messages": [
            {"role": "user", "content": "Book a meeting tomorrow at 3pm."}
        ]
    }

    response = client.post("/chat", json=payload)
    assert response.status_code == 200

    data = response.json()
    print("Agent Response:", data.get("response"))
    assert "response" in data

    # Test second message
    payload["messages"].append({"role": "assistant", "content": "Got the date! What time works for you?"})
    payload["messages"].append({"role": "user", "content": "3:00 PM"})

    response = client.post("/chat", json=payload)
    assert response.status_code == 200

    data = response.json()
    print("Agent Response 2:", data.get("response"))
    assert "response" in data

if __name__ == "__main__":
    test_chat()
