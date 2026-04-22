from fastapi import APIRouter, UploadFile, File, Form
from backend.services.parser import extract_text
from backend.services.skills import extract_skills
from backend.services.embeddings import get_similarity
from backend.services.scoring import calculate_score

router = APIRouter()

@router.post("/analyze")
async def analyze(file: UploadFile = File(...), jd: str = Form(...)):
    
    resume_text = extract_text(file)
    
    resume_skills = extract_skills(resume_text)
    jd_skills = extract_skills(jd)
    
    similarity = get_similarity(resume_text, jd)
    final_score = calculate_score(similarity, resume_skills, jd_skills)
    
    # ✅ define these first
    matched_skills = list(set(resume_skills) & set(jd_skills))
    missing_skills = list(set(jd_skills) - set(resume_skills))
    
    return {
        "match_score": final_score,
        "resume_skills": resume_skills,
        "jd_skills": jd_skills,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,

        "recommendations": [
            f"Consider adding experience with {skill}"
            for skill in missing_skills[:3]
        ],

        "summary": f"You match {final_score}% of the job requirements. Improve missing skills to increase your chances."
    }