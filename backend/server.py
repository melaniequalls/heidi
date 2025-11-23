from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from agents.agent0 import agent0
from agents.agent1 import agent1
from agents.agent2 import agent2
from agents.agent3 import agent3
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # or "http://localhost:5173"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.post("/analyze")
async def analyze_patient(request: Request):
    data = await request.json()

    # Text from frontend
    patient_text = data.get("text", "")

    # Agent 0 -> Agent 1 -> Agent 2
    agent0_output = agent0(patient_text)
    agent1_output = agent1(agent0_output)
    agent2_output = agent2(agent1_output)

    return {
        "agent0_output": agent0_output,
        "agent1_output": agent1_output,
        "agent2_output": agent2_output
    }

