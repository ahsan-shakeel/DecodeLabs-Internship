# Rule-Based AI Chatbot

A lightweight, deterministic rule-based chatbot implemented in Python. Designed as a foundational AI logic engine and guardrail prototype demonstrating intent mapping, input sanitization, safe fallback handling, and structured command-driven lifecycle management.

---

## Features

- **Deterministic Intent Matching:** Utilizes an exact key-value knowledge base dictionary for instantaneous $O(1)$ response lookups.
- **Input Sanitization & Normalization:** Strips trailing/leading whitespace and normalizes text casing to guarantee predictable intent evaluation.
- **Graceful Fallback Handling:** Implements dictionary `.get()` retrieval to handle unrecognized queries safely without throwing unhandled exceptions.
- **Clean Execution Loop:** Continuous interactive console loop featuring safe termination via an explicit exit command (`exit`).

---

## Project Structure

```text
rule-based-chatbot/
│
├── chatbot.py          # Main application script containing chatbot engine
└── README.md           # Project documentation
```

---

## Knowledge Base & Supported Intents

| User Input (Normalized) | Chatbot Response |
| :--- | :--- |
| `hello` | *Hi there!* |
| `hi` | *Greetings! Welcome to the team.* |
| `how are you` | *I am a rule-based logic engine, running at optimal efficiency.* |
| `what is your purpose` | *I act as a deterministic filter and foundational AI guardrail.* |
| `who made you` | *I was built by a DecodeLabs AI Engineering Intern.* |
| `bye` | *Goodbye!* |
| `exit` | *Initiating kill command. Shutting down.* (Terminates loop) |
| *(Any unknown input)* | *I do not understand.* (Default fallback) |

---

## Getting Started

### Prerequisites

- **Python 3.8+** installed on your system.

Verify your installation:
```bash
python --version
# or
python3 --version
```

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/rule-based-chatbot.git
   cd rule-based-chatbot
   ```

2. **Run the script:**
   ```bash
   python chatbot.py
   ```

---

## Usage Example

```text
System Online. Type 'exit' to trigger the kill command.
You: Hello
Bot: Hi there!
You: What is your purpose
Bot: I act as a deterministic filter and foundational AI guardrail.
You: Tell me a joke
Bot: I do not understand.
You: exit
Bot: Initiating kill command. Shutting down.
```

---

## How It Works

1. **Knowledge Base Definition:** A Python dictionary stores intent patterns as keys and pre-configured responses as values.
2. **Interactive Loop:** A `while True` loop prompts user input continuously.
3. **Pre-processing:** User input is processed using `.lower().strip()` to eliminate case mismatches and irregular whitespace.
4. **Command Check & Response Engine:** Checks if the command is `exit` to break the loop; otherwise, queries the dictionary using `.get()` with a standardized fallback response.

---


