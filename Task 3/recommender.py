import math
import csv
import re
from typing import List, Dict, Any, Tuple, Optional

class TechStackRecommender:
    """
    Content-Based AI Recommendation Engine (Digital Matchmaker)
    Implements the 4-step pipeline (Ingestion, Scoring, Sorting, Filtering)
    using TF-IDF feature weighting and Cosine Similarity.
    """

    def __init__(self, dataset_path: str = "raw_skills.csv"):
        self.dataset_path = dataset_path
        self.items: List[Dict[str, Any]] = []
        self.vocabulary: List[str] = []
        self.term_to_index: Dict[str, int] = {}
        self.doc_frequencies: Dict[str, int] = {}
        self.idf_vector: List[float] = []
        self.item_vectors: List[List[float]] = []
        
        self.load_dataset()
        self.build_vocabulary_and_tfidf()

    def _normalize_term(self, term: str) -> str:
        """Standardize terms: lowercased, stripped, extra whitespace removed."""
        return term.strip().lower()

    def _extract_tokens(self, text: str) -> List[str]:
        """Extract individual skill tokens from comma-separated or space-separated text."""
        # Split by comma or slash or semicolon
        raw_tokens = re.split(r'[,;/]+', text)
        tokens = []
        for raw in raw_tokens:
            cleaned = self._normalize_term(raw)
            if cleaned:
                tokens.append(cleaned)
        return tokens

    def load_dataset(self) -> None:
        """Load job role items and their skill attributes from raw_skills.csv."""
        self.items = []
        with open(self.dataset_path, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                skills_list = self._extract_tokens(row['required_skills'])
                self.items.append({
                    'role_id': int(row['role_id']),
                    'role_title': row['role_title'],
                    'category': row['category'],
                    'required_skills': row['required_skills'],
                    'skills_list': skills_list,
                    'recommended_tools': row['recommended_tools'],
                    'description': row['description'],
                    'popularity_score': float(row.get('popularity_score', 50))
                })

    def build_vocabulary_and_tfidf(self) -> None:
        """
        Build shared vocabulary space and precalculate TF-IDF vectors for all items.
        TF = (Count of term t in doc d) / (Total terms in doc d)
        IDF = log( Total Documents / Documents with term t )
        """
        unique_terms = set()
        for item in self.items:
            for skill in item['skills_list']:
                unique_terms.add(skill)
        
        self.vocabulary = sorted(list(unique_terms))
        self.term_to_index = {term: idx for idx, term in enumerate(self.vocabulary)}
        total_docs = len(self.items)

        # Calculate Document Frequency (DF) for each term
        self.doc_frequencies = {term: 0 for term in self.vocabulary}
        for item in self.items:
            item_unique_skills = set(item['skills_list'])
            for skill in item_unique_skills:
                self.doc_frequencies[skill] += 1

        # Calculate IDF according to exact PDF formula: log( Total Docs / Docs with term t )
        # Using math.log (natural log) or math.log10. PDF uses log(N / df).
        # We add a small smoothing denominator (+1 or checking df > 0) to avoid division by zero.
        self.idf_vector = [0.0] * len(self.vocabulary)
        for term, idx in self.term_to_index.items():
            df = self.doc_frequencies.get(term, 0)
            if df > 0:
                self.idf_vector[idx] = math.log(total_docs / df)
            else:
                self.idf_vector[idx] = 0.0

        # Calculate TF-IDF vectors for all items
        self.item_vectors = []
        for item in self.items:
            vector = self._compute_tfidf_vector(item['skills_list'])
            self.item_vectors.append(vector)

    def _compute_tfidf_vector(self, tokens: List[str]) -> List[float]:
        """Compute TF-IDF numerical vector for a given list of tokens."""
        vector = [0.0] * len(self.vocabulary)
        if not tokens:
            return vector
            
        total_terms = len(tokens)
        term_counts: Dict[str, int] = {}
        for token in tokens:
            term_counts[token] = term_counts.get(token, 0) + 1

        for token, count in term_counts.items():
            if token in self.term_to_index:
                idx = self.term_to_index[token]
                tf = count / total_terms
                idf = self.idf_vector[idx]
                vector[idx] = tf * idf
                
        return vector

    @staticmethod
    def cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
        """
        Compute Cosine Similarity score:
        cos(theta) = (A . B) / (||A|| * ||B||)
        """
        dot_product = sum(a * b for a, b in zip(vec_a, vec_b))
        norm_a = math.sqrt(sum(a * a for a in vec_a))
        norm_b = math.sqrt(sum(b * b for b in vec_b))

        if norm_a == 0.0 or norm_b == 0.0:
            return 0.0

        return dot_product / (norm_a * norm_b)

    def ingest(self, user_skills: List[str], enforce_min_skills: bool = True) -> List[str]:
        """
        Step 1 of 4-step pipeline: Ingestion.
        Validates minimum user input requirement (minimum 3 inputs).
        """
        tokens = []
        for skill in user_skills:
            tokens.extend(self._extract_tokens(skill))
            
        if enforce_min_skills and len(tokens) < 3:
            raise ValueError(
                f"Ingestion Error: Minimum 3 skills required for accurate pattern alignment. "
                f"Received only {len(tokens)}: {tokens}"
            )
            
        return tokens

    def score(self, user_vector: List[float]) -> List[Tuple[Dict[str, Any], float]]:
        """
        Step 2 of 4-step pipeline: Scoring.
        Loops through every item in dataset and calculates Cosine Similarity score.
        """
        scored_items = []
        for item, item_vec in zip(self.items, self.item_vectors):
            similarity_score = self.cosine_similarity(user_vector, item_vec)
            scored_items.append((item, similarity_score))
        return scored_items

    def sort(self, scored_items: List[Tuple[Dict[str, Any], float]]) -> List[Tuple[Dict[str, Any], float]]:
        """
        Step 3 of 4-step pipeline: Sorting.
        Sorts dataset in descending order based on calculated cosine similarity scores.
        """
        return sorted(scored_items, key=lambda x: x[1], reverse=True)

    def filter(self, sorted_items: List[Tuple[Dict[str, Any], float]], top_n: int = 3) -> List[Dict[str, Any]]:
        """
        Step 4 of 4-step pipeline: Filtering.
        Truncates the list to Top-N items and formats response metadata.
        """
        top_matches = sorted_items[:top_n]
        results = []
        for rank, (item, score) in enumerate(top_matches, start=1):
            results.append({
                'rank': rank,
                'role_id': item['role_id'],
                'role_title': item['role_title'],
                'category': item['category'],
                'similarity_score': round(score, 4),
                'match_percentage': f"{round(score * 100, 1)}%",
                'required_skills': item['required_skills'],
                'recommended_tools': item['recommended_tools'],
                'description': item['description'],
                'popularity_score': item['popularity_score']
            })
        return results

    def recommend(self, user_skills: List[str], top_n: int = 3, enforce_min_skills: bool = True) -> List[Dict[str, Any]]:
        """
        Execute full 4-step ranking pipeline:
        Ingestion -> Scoring -> Sorting -> Filtering
        """
        # Step 1: Ingestion
        tokens = self.ingest(user_skills, enforce_min_skills=enforce_min_skills)
        
        # Vectorize user profile
        user_vector = self._compute_tfidf_vector(tokens)
        
        # Handle User Cold Start (vector sum is 0)
        if sum(user_vector) == 0.0:
            return self.get_trending_fallback(top_n=top_n, reason="Cold Start: No matching terms found in vocabulary.")

        # Step 2: Scoring
        scored = self.score(user_vector)

        # Step 3: Sorting
        sorted_scored = self.sort(scored)

        # Step 4: Filtering
        return self.filter(sorted_scored, top_n=top_n)

    def get_trending_fallback(self, top_n: int = 3, reason: str = "Cold Start Bypass") -> List[Dict[str, Any]]:
        """Cold Start bypass: Returns top trending/popular items."""
        sorted_by_popularity = sorted(self.items, key=lambda x: x['popularity_score'], reverse=True)
        results = []
        for rank, item in enumerate(sorted_by_popularity[:top_n], start=1):
            results.append({
                'rank': rank,
                'role_id': item['role_id'],
                'role_title': item['role_title'],
                'category': item['category'],
                'similarity_score': 0.0,
                'match_percentage': "Trending Fallback",
                'required_skills': item['required_skills'],
                'recommended_tools': item['recommended_tools'],
                'description': item['description'],
                'popularity_score': item['popularity_score'],
                'fallback_reason': reason
            })
        return results

    def inspect_tfidf_weights(self, user_skills: List[str]) -> Dict[str, float]:
        """Utility to inspect computed TF-IDF weights for given user input skills."""
        tokens = self._extract_tokens(",".join(user_skills))
        user_vector = self._compute_tfidf_vector(tokens)
        weights = {}
        for idx, val in enumerate(user_vector):
            if val > 0:
                weights[self.vocabulary[idx]] = round(val, 4)
        return dict(sorted(weights.items(), key=lambda x: x[1], reverse=True))

def start_http_server(port: int = 8000) -> None:
    import http.server
    import socketserver
    import os
    import sys
    import webbrowser

    # Ensure working directory is the script's directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)

    handler = http.server.SimpleHTTPRequestHandler
    httpd = None
    actual_port = port

    # Try binding starting from specified port up to 10 fallback ports
    for p in range(port, port + 10):
        try:
            httpd = socketserver.TCPServer(("", p), handler)
            actual_port = p
            break
        except OSError:
            continue

    if not httpd:
        httpd = socketserver.TCPServer(("", 0), handler)
        actual_port = httpd.server_address[1]

    url = f"http://127.0.0.1:{actual_port}"

    print("\n" + "=" * 60, flush=True)
    print("AI Recommendation Logic - Digital Matchmaker Web Server", flush=True)
    print("=" * 60, flush=True)
    print(f"Server running at: {url}", flush=True)
    print(f"Clickable link:  {url}", flush=True)
    print("=" * 60, flush=True)
    print("Press Ctrl+C to stop the server.\n", flush=True)

    try:
        webbrowser.open(url)
    except Exception:
        pass

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping HTTP server...")
        httpd.server_close()
        sys.exit(0)

if __name__ == "__main__":
    recommender = TechStackRecommender()
    print(f"Loaded {len(recommender.items)} job roles. Vocabulary size: {len(recommender.vocabulary)}")
    start_http_server(port=8000)

