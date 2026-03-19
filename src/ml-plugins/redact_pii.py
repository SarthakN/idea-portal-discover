import re
import spacy
import argparse

# Load spaCy English model
nlp = spacy.load("en_core_web_sm")

# Regex patterns
EMAIL_REGEX = r'[\w\.-]+@[\w\.-]+\.\w+'
PHONE_REGEX = r'\+?\d[\d\s\-\(\)]{7,}\d'

def redact_text(text: str) -> str:
    """Redacts common PII from input text using regex and NER."""
    if not isinstance(text, str) or not text.strip():
        return text

    # Regex redaction
    text = re.sub(EMAIL_REGEX, '[EMAIL REDACTED]', text)
    text = re.sub(PHONE_REGEX, '[PHONE REDACTED]', text)

    # NER redaction
    doc = nlp(text)
    redacted = ''
    last_end = 0

    for ent in doc.ents:
        if ent.label_ in ['PERSON', 'GPE', 'LOC', 'ORG', 'DATE', 'NORP']:
            redacted += text[last_end:ent.start_char] + f'[{ent.label_} REDACTED]'
            last_end = ent.end_char

    redacted += text[last_end:]
    return redacted

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Redact PII from input text.")
    parser.add_argument("text", type=str, help="Input text with potential PII", nargs="+")
    args = parser.parse_args()

    # Combine all arguments into a single string
    input_text = " ".join(args.text)
    cleaned_text = redact_text(input_text)
    print("\n🔍 Redacted Text:")
    print(cleaned_text)
