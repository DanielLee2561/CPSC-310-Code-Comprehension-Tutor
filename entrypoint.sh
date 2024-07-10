# REFERENCE: https://stackoverflow.com/questions/78500319/how-to-pull-model-automatically-with-container-creation
#!/bin/bash

# Start Ollama in the background.
/bin/ollama serve &
# Record Process ID.
pid=$!

# Pause for Ollama to start.
sleep 5

echo "🔴 Retrieve model..."
ollama pull codegemma
echo "🟢 Done!"

# Wait for Ollama process to finish.
wait $pid