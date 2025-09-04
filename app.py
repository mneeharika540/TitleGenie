from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
from keybert import KeyBERT

# Initialize Flask app
app = Flask(__name__, template_folder="templates", static_folder="static")  
CORS(app)

# Load Flan-T5 model
model_name = "srishtiiiiiiiiiii/flan-t5-title-gen"  
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

# Create pipeline
title_generator = pipeline("text2text-generation", model=model, tokenizer=tokenizer)

# Initialize KeyBERT for tags
kw_model = KeyBERT()

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/contact")
def contact():
    return render_template("contact.html")

@app.route("/login")
def login():
    return render_template("login.html")

@app.route("/terms")
def terms():
    return render_template("terms.html")  

# Health check endpoint
@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "message": "Server is running fine"}), 200

@app.route("/generate", methods=["POST"])
def generate():
    try:
        data = request.get_json()
        description = data.get("description", "")

        if not description.strip():
            return jsonify({"error": "No description provided"}), 400

        # Generate YouTube title
        title_prompt = f"Generate a catchy YouTube video title for: {description}"
        title_output = title_generator(title_prompt, max_length=32, num_return_sequences=1)
        title = title_output[0]["generated_text"]

        # Generate tags using KeyBERT
        tags = kw_model.extract_keywords(description, top_n=8)
        tags = [tag[0] for tag in tags]

        return jsonify({
            "title": title,
            "tags": tags
        })

    except Exception as e:
        return jsonify({"error": f"Error generating output: {str(e)}"}), 500

if __name__ == "__main__":
    pass

