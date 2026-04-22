SKILLS = [
    "python", "java", "c++", "machine learning", "deep learning",
    "nlp", "tensorflow", "pytorch", "fastapi", "flask",
    "react", "node.js", "sql", "mongodb", "docker", "kubernetes"
]

def extract_skills(text):
    text = text.lower()
    
    found_skills = []
    
    for skill in SKILLS:
        if skill in text:
            found_skills.append(skill)
    
    return list(set(found_skills))