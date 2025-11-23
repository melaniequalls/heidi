import os
import json
from dotenv import load_dotenv
from anthropic import Anthropic
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class PatientRequest(BaseModel):
    patient_json: dict  # JSON input containing only suggested_meds and basic patient info

# ---------------------------------------
# Initialization
# ---------------------------------------

load_dotenv()
client = Anthropic(api_key=os.getenv("ARYA_API_KEY"))

# ---------------------------------------
# LLM Caller (Strict JSON + Closed World)
# ---------------------------------------
def call_llm_json(prompt: str, patient_json: dict):

    system_prompt = """
You are Agent Filter.

You DO NOT have medical knowledge.
You MUST NOT generate new content.
You MUST NOT hallucinate, invent, or modify any medication names.

You operate under the following NON-NEGOTIABLE LAWS:

1. CLOSED-WORLD RULE:
   All medication names MUST come *exclusively* from patient_json["suggested_meds"].
   You MUST NOT add, remove, merge, split, paraphrase, or change capitalization.

2. EXACT-SET RULE:
   The union of acceptable_meds and unacceptable_meds[*].med MUST match EXACTLY
   the input set of suggested_meds — no more, no less.

3. IMMUTABILITY RULE:
   Medication names must appear as EXACT UTF-8 string copies of the input.
   No punctuation changes, no normalization.

4. DETERMINISM RULE:
   Output MUST be deterministic and must NOT include any randomness.

5. JSON-ONLY RULE:
   Output MUST be valid JSON, no text outside JSON.
"""

    user_prompt = f"""
You will classify medications strictly using literal string comparisons only.

Patient JSON:
{json.dumps(patient_json, indent=2)}

Follow these rules:
- No inference.
- No synonyms.
- No medical reasoning.
- No string changes.
- Only exact match logic.

Output JSON must be:

{{
  "acceptable_meds": ["med1"],
  "unacceptable_meds": [
    {{"med": "medX", "reasons": ["reason1"]}}
  ]
}}

Return ONLY JSON.
"""

    while True:
        response = client.messages.create(
            model="claude-3-5-haiku-latest",
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}],
            temperature=0,
            max_tokens=2000
        )

        raw = response.content[0].text.strip()

        try:
            result = json.loads(raw)
        except:
            # repair stage
            repair_prompt = f"""
Output valid JSON only. Fix this:

{raw}
"""
            repair = client.messages.create(
                model="claude-3-5-haiku-latest",
                system="Return ONLY valid JSON.",
                messages=[{"role": "user", "content": repair_prompt}],
                temperature=0,
                max_tokens=1000
            )
            try:
                result = json.loads(repair.content[0].text.strip())
            except:
                continue

        acceptable = [m for m in result.get("acceptable_meds", []) if isinstance(m, str)]
        unacceptable = [item.get("med") for item in result.get("unacceptable_meds", []) if isinstance(item.get("med"), str)]

        output_meds = set(acceptable + unacceptable)
        input_meds = set(patient_json.get("suggested_meds", []))

        if output_meds == input_meds:
            return result

# ---------------------------------------
# Medication Filter Prompt
# ---------------------------------------
MED_FILTER_PROMPT = """
Classify each medication from 'suggested_meds' using ONLY the fields in the JSON:
- allergies
- conditions
- pregnant
- age
- diagnosis

Rules:
1. DO NOT add, remove, or rename any medications.
2. Only use exact string matches against the fields above.
3. All medications must appear EXACTLY ONCE in the output.
4. If no conflict exists in the JSON, classify as acceptable.
5. Reasons for unacceptable must be direct string matches only.

Output STRICT JSON ONLY:

{
  "acceptable_meds": [],
  "unacceptable_meds": [
    {"med": "", "reasons": []}
  ]
}
"""

# ---------------------------------------
# Main Filtering Function
# ---------------------------------------
def agent3(patient_json: dict):
    prompt = MED_FILTER_PROMPT + "\n\nPatient data:\n" + json.dumps(patient_json, indent=2)
    result = call_llm_json(prompt, patient_json)

    # Normalize reasons
    for item in result.get("unacceptable_meds", []):
        item["reasons"] = [str(r).strip() for r in item.get("reasons", [])]

    return result



