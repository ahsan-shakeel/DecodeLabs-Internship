import unittest
import math
from recommender import TechStackRecommender

class TestTechStackRecommender(unittest.TestCase):
    def setUp(self):
        self.recommender = TechStackRecommender(dataset_path="raw_skills.csv")

    def test_dataset_loading(self):
        """Test dataset and vocabulary are properly loaded."""
        self.assertGreaterEqual(len(self.recommender.items), 20)
        self.assertGreater(len(self.recommender.vocabulary), 30)
        self.assertIn("python", self.recommender.vocabulary)
        self.assertIn("sql", self.recommender.vocabulary)

    def test_ingestion_minimum_skills_rule(self):
        """Test that ingestion requires minimum 3 skills when enforced."""
        # < 3 skills should raise ValueError
        with self.assertRaises(ValueError) as ctx:
            self.recommender.recommend(["Python", "SQL"], enforce_min_skills=True)
        self.assertIn("Minimum 3 skills required", str(ctx.exception))

        # 3 or more skills should succeed
        results = self.recommender.recommend(["Python", "SQL", "Machine Learning"], enforce_min_skills=True)
        self.assertEqual(len(results), 3)

    def test_cosine_similarity_math(self):
        """Test Cosine Similarity mathematical accuracy."""
        vec_a = [1.0, 0.0, 1.0]
        vec_b = [1.0, 0.0, 1.0]
        self.assertTrue(math.isclose(TechStackRecommender.cosine_similarity(vec_a, vec_b), 1.0))

        vec_c = [0.0, 1.0, 0.0]
        self.assertTrue(math.isclose(TechStackRecommender.cosine_similarity(vec_a, vec_c), 0.0))

        vec_d = [1.0, 1.0, 0.0]
        self.assertTrue(math.isclose(TechStackRecommender.cosine_similarity(vec_a, vec_d), 0.5))

    def test_tfidf_weighting_specificity(self):
        """
        Test slide 11 principle: Specific/rare terms get higher IDF weight 
        than generic/frequent terms.
        """
        python_idx = self.recommender.term_to_index.get("python")
        airflow_idx = self.recommender.term_to_index.get("airflow")
        
        self.assertIsNotNone(python_idx)
        self.assertIsNotNone(airflow_idx)
        
        idf_python = self.recommender.idf_vector[python_idx]
        idf_airflow = self.recommender.idf_vector[airflow_idx]
        
        self.assertGreater(idf_airflow, idf_python)

    def test_sample_cloud_recommendation(self):
        """Test recommendation for ['Python', 'Cloud Computing', 'Automation']."""
        user_skills = ["Python", "Cloud Computing", "Automation"]
        top_matches = self.recommender.recommend(user_skills, top_n=3)
        
        self.assertEqual(len(top_matches), 3)
        top_titles = [m['role_title'] for m in top_matches]
        
        expected_candidates = {"Cloud Architect", "DevOps Engineer", "Site Reliability Engineer (SRE)", "Systems Administrator"}
        matched_expected = set(top_titles).intersection(expected_candidates)
        self.assertGreaterEqual(len(matched_expected), 1)
        self.assertGreater(top_matches[0]['similarity_score'], 0.0)

    def test_cold_start_fallback(self):
        """Test cold-start fallback when unknown skills are entered."""
        user_skills = ["UnknownSkill1", "UnknownSkill2", "UnknownSkill3"]
        results = self.recommender.recommend(user_skills, enforce_min_skills=True)
        
        self.assertEqual(len(results), 3)
        self.assertEqual(results[0]['match_percentage'], "Trending Fallback")
        self.assertIn("Cold Start", results[0]['fallback_reason'])

if __name__ == "__main__":
    unittest.main()

