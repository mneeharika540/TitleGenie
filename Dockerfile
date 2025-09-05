FROM python:3.9-slim

WORKDIR /app

# Avoid cache permission issues
ENV TRANSFORMERS_CACHE=/app/hf_cache
ENV HF_HOME=/app/hf_cache
ENV PORT=7860

COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Expose the port
EXPOSE 7860

CMD ["gunicorn", "-b", "0.0.0.0:7860", "app:app"]
