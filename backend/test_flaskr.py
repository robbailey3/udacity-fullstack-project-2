import os
import unittest
import json
from flask_sqlalchemy import SQLAlchemy

from flaskr import create_app
from models import setup_db, Question, Category


class TriviaTestCase(unittest.TestCase):
    """This class represents the trivia test case"""

    def setUp(self):
        """Define test variables and initialize app."""
        self.app = create_app()
        self.client = self.app.test_client
        self.username = 'postgres'
        self.password = 'password'
        self.database_name = "trivia_test"
        self.database_path = "postgresql://{}:{}@{}/{}".format(self.username, self.password,
                                                               'localhost:5432', self.database_name)
        setup_db(self.app, self.database_path)

        # binds the app to the current context
        with self.app.app_context():
            self.db = SQLAlchemy()
            self.db.init_app(self.app)
            # create all tables
            self.db.create_all()

    def tearDown(self):
        """Executed after reach test"""
        pass

    ''' TEST CASE: [GET]/questions '''

    def test_get_questions(self):
        """Test the successful response for the '/questions' endpoint """
        res = self.client().get('/questions')
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertEqual(data['success'], True)

    ''' TEST CASE: [GET]/categories '''

    def test_get_categories(self):

        res = self.client().get('/categories')
        self.assertEqual(res.status_code, 200)

    def test_delete_question(self):
        # Note: A question with an ID of 1 needs to be in the Database for this to pass
        # TODO: Make it more generic so it just deletes a question without needing to explicitly specify an ID
        res = self.client().delete('/questions/10')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(json.loads(res.data)['success'], True)

    ''' TEST CASE: [POST]/questions '''

    def test_create_question(self):
        new_question = {
            "question": "Test",
            "answer": "Test",
            "category": 1,
            "difficulty": 1
        }
        res = self.client().post('questions', data=new_question)
        self.assertEqual(res.status_code, 200)
    ''' TEST CASE: [DELETE]/questions/{id} '''

    def test_get_question(self):
        res = self.client().delete('/questions/1')
        self.assertEqual(res.status_code, 200)

    ''' TEST CASE: [POST]/questions/search '''

    def test_search_question(self):
        res = self.client().post('/questions/search', data=json.dumps(dict(searchTerm="World")),
                                 content_type="application/json")
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        # Check that at least one question is returned
        self.assertGreater(len(data['questions']), 0)
        return

    ''' TEST CASE: [POST]/category/1/questions '''

    def test_get_question_by_category(self):
        category_id = 2
        res = self.client().get('/categories/1/questions')
        self.assertEqual(res.status_code, 200)

    def test_page_not_found(self):
        res = self.client().get('/urlthatdoesnotexist')
        self.assertEqual(res.status_code, 404)

        # Make the tests conveniently executable
if __name__ == "__main__":
    unittest.main()
