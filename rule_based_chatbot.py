# Project 1: Rule-Based AI Chatbot

def main():
    # 1. KNOWLEDGE BASE: Dictionary with 5+ intents
    responses = {
        'hello': 'Hi there!',
        'hi': 'Greetings! Welcome to the team.',
        'how are you': 'I am a rule-based logic engine, running at optimal efficiency.',
        'what is your purpose': 'I act as a deterministic filter and foundational AI guardrail.',
        'who made you': 'I was built by a DecodeLabs AI Engineering Intern.',
        'bye': 'Goodbye!'
    }

    print("System Online. Type 'exit' to trigger the kill command.")

    # 2. INPUT LOOP: Continuous 'while' cycle
    while True:
        raw_input = input('You: ')
        
        # 3. SANITIZATION: Handle case & whitespace
        clean_input = raw_input.lower().strip()
        
        # 4. EXIT STRATEGY: Clean break command
        if clean_input == 'exit':
            print("Bot: Initiating kill command. Shutting down.")
            break
            
        # 5. FALLBACK & PROCESS: The .get() Method
        reply = responses.get(clean_input, 'I do not understand.')
        
        # RESPONSE ENGINE (Output)
        print(f"Bot: {reply}")

if __name__ == "__main__":
    main()