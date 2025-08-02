from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import NearestNeighbors

app = Flask(__name__)
CORS(app)  # Allow requests from frontend

# Load dataset
df = pd.read_csv("final.csv")
df.fillna("", inplace=True)

# Combine features into a single column
df["combined"] = (
    df["Preferred_technologies"].astype(str) + " " +
    df["Experience_level"].astype(str) + " " +
    df["Domain"].astype(str) + " " +
    df["budget"].astype(str)
)

# TF-IDF Vectorization
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(df["combined"])

# Nearest Neighbor Model
nn = NearestNeighbors(n_neighbors=20, metric='cosine')
nn.fit(X)

# Recommendation Function
def recommend_project(tech, level, domain, budget):
    query = f"{tech} {level} {domain} {budget}"
    vec = vectorizer.transform([query])
    distances, indices = nn.kneighbors(vec)
    recommendations = df.iloc[indices[0]][["Project_name", "description", "industry"]]
    return recommendations.to_dict(orient='records')

# API Endpoint
@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    tech = data.get("tech", "")
    level = data.get("level", "")
    domain = data.get("domain", "")
    budget = data.get("budget", "")

    results = recommend_project(tech, level, domain, budget)
    return jsonify(results)

# Run the app
if __name__ == '__main__':
    app.run(debug=True)
