import os
import json
from dotenv import load_dotenv
from anthropic import Anthropic

# ---------------------------------------
# Initialization
# ---------------------------------------

load_dotenv()
client = Anthropic(api_key=os.getenv("ARYA_API_KEY"))

# ---------------------------------------
# LLM Caller
# ---------------------------------------

def call_llm(prompt: str):
    response = client.messages.create(
        model="claude-3-5-haiku-latest",
        max_tokens=1000,
        temperature=0,
        messages=[
            {"role": "user", "content": [{"type": "text", "text": prompt}]}
        ]
    )
    return response.content[0].text


# ---------------------------------------
# Agent 1 Prompt
# ---------------------------------------

AGENT1_PROMPT = """
You are Agent 1.

Your job is simple:

Given structured patient data (from Agent 0), generate a SHORT list of reasonable medication candidates
for the patient's *diagnosis*.




-------------------------
OUTPUT REQUIREMENTS
-------------------------

Output STRICT JSON ONLY:

{{
  "diagnosis": "<diagnosis>",
  "candidate_treatments": ["drug1", "drug2", ...]
}}

RULES FOR candidate_treatments:
1. 3–10 items max
2. Generic drug names only
3. Lowercase strings only
4. Must be actual medications (no brand names, no supportive care)
5. You may include drugs that *might* be considered for the diagnosis,
   but do not intentionally add incorrect or irrelevant medications.

-------------------------
PATIENT DATA
-------------------------
{patient_json}

Now output ONLY the JSON described above.
"""


# ---------------------------------------
# Agent 1 Main Function
# ---------------------------------------

def agent1(patient: dict) -> dict:

    diagnosis = (patient.get("diagnosis") or "").strip()

    if not diagnosis:
        return {"diagnosis": "", "candidate_treatments": []}

    patient_json = json.dumps(patient, indent=2)

    prompt = AGENT1_PROMPT.format(patient_json=patient_json)
    raw = call_llm(prompt)

    # Try parse
    try:
        data = json.loads(raw)
        return data
    except:
        repair_prompt = f"""
Fix this into valid JSON ONLY:

{raw}

Correct schema:

{{
  "diagnosis": "{diagnosis}",
  "candidate_treatments": ["drug1", "drug2"]
}}
"""
        repaired = call_llm(repair_prompt)
        try:
            return json.loads(repaired)
        except:
            return {"diagnosis": diagnosis.lower(), "candidate_treatments": []}

