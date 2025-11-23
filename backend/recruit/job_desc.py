import spacy
from pathlib import Path

import sys,fitz

BASE_DIR = Path(__file__).resolve().parent.parent
model_path= BASE_DIR / "ml" / "JdModel" / "output" / "model-best"
try:
    jdnlp = spacy.load(model_path)
except OSError:
    jdnlp = spacy.blank("en")

def extract_jdtext_from_pdf(pdf_path):
    text=""
    try:
        with fitz.open(pdf_path) as pdf_document:
            for page_num in range(pdf_document.page_count):
                page = pdf_document[page_num]
                text += page.get_text()
                
    except Exception as e:
        print(f"Error: {e}")
        
    return text
