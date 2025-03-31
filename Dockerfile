# Use an official Python runtime as a base image
FROM python:3.9

# Set the working directory
WORKDIR /app

# Copy project files
COPY . .

# Install dependencies
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port your chatbot runs on
EXPOSE 5000

# Command to run the chatbot
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
