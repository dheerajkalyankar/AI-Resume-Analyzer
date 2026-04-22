def calculate_score(similarity, resume_skills, jd_skills):
    
    matched = len(set(resume_skills) & set(jd_skills))
    total = len(jd_skills) if jd_skills else 1
    
    skill_score = matched / total
    
    # bonus if at least half skills match
    bonus = 0.05 if skill_score >= 0.5 else 0
    
    final_score = (similarity * 0.4) + (skill_score * 0.6) + bonus
    
    return round(min(final_score, 1) * 100, 2)