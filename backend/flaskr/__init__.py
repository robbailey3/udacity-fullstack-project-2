import os
from flask import Flask, request, abort, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import random
from time import time
from models import setup_db, Question, Category, db

QUESTIONS_PER_PAGE = 10


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__)
    setup_db(app)
    # Set up cors (sets Access-Control-Allow-Origin to '*')
    cors = CORS(app)

    # Set up the headers
    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Headers',
                             'Content-Type, Authorization')
        response.headers.add('Access-Control-Allow-Methods',
                             'GET, POST, PATCH, PUT, DELETE, OPTIONS')
        return response

    '''
  @TODO: 
  Create an endpoint to handle GET requests 
  for all available categories.
  '''
    @app.route('/categories')
    def getAllCategories():
        try:
            categories = []
            categories = Category.query.order_by(Category.id).all()

            formatted_categories = [category.format()
                                    for category in categories]
            return jsonify({
                "result": formatted_categories,
                "timestamp": time() * 1000,
                "success": True,
                "count": len(formatted_categories)
            })
        except:
            abort(500)

    '''
  @TODO: 
  Create an endpoint to handle GET requests for questions, 
  including pagination (every 10 questions). 
  This endpoint should return a list of questions, 
  number of total questions, current category, categories. 

  TEST: At this point, when you start the application
  you should see questions and categories generated,
  ten questions per page and pagination at the bottom of the screen for three pages.
  Clicking on the page numbers should update the questions. 
  '''
    @app.route('/questions')
    def get_questions():
        try:
            page = request.args.get('page', 1, type=int)
            questions = []
            questions = Question.query.order_by(
                Question.id).all()

            offset = (page - 1) * QUESTIONS_PER_PAGE
            questions = questions[offset:offset+QUESTIONS_PER_PAGE]
            formatted_questions = [question.format() for question in questions]

            categories = Category.query.order_by(Category.id).all()
            formatted_categories = [category.format()
                                    for category in categories]

            result = {
                "success": True,
                "questions": formatted_questions,
                "total_questions": len(questions),
                "categories": formatted_categories,
                "timestamp": time() * 1000,
                "current_category": None}
            return jsonify(result)

        except Exception as err:
            print(str(err))
            abort(500)

    '''
  @TODO: 
  Create an endpoint to DELETE question using a question ID. 

  TEST: When you click the trash icon next to a question, the question will be removed.
  This removal will persist in the database and when you refresh the page. 
  '''
    @app.route('/questions/<int:question_id>', methods=["DELETE"])
    def delete_question(question_id):
        try:
            question = Question.query.filter(
                Question.id == question_id).one_or_none()

            if (question is None):
                # Prefer a graceful failure if the question does not exist
                return jsonify({
                    'success': False,
                    'message': 'question does not exist'
                })
            # Use the delete method of the question class.
            question.delete()

            return jsonify({'success': True,
                            'deleted_question': question.format(),
                            'total_questions': len(Question.query.all())})

        except:
            abort(500)
    '''
  @TODO: 
  Create an endpoint to POST a new question, 
  which will require the question and answer text, 
  category, and difficulty score.

  TEST: When you submit a question on the "Add" tab, 
  the form will clear and the question will appear at the end of the last page
  of the questions list in the "List" tab.  
  '''
    @app.route('/questions', methods=['POST'])
    def create_new_question():
        try:
            body = request.get_json()
            user_input = {
                "question": body.get('question', None),
                "answer": body.get('answer', None),
                "difficulty": body.get('difficulty', None),
                "category": body.get('category', None)
            }
            question = Question(question=user_input['question'],
                                answer=user_input['answer'],
                                difficulty=user_input['difficulty'],
                                category=user_input['category'])

            db.session.add(question)
            db.session.commit()
            return jsonify({'success': True})
        except Exception as err:
            db.session.rollback()
            db.session.close()
            return jsonify({'success': False, 'error': str(err)})

    '''
  @TODO: 
  Create a POST endpoint to get questions based on a search term. 
  It should return any questions for whom the search term 
  is a substring of the question. 

  TEST: Search by any phrase. The questions list will update to include 
  only question that include that string within their question. 
  Try using the word "title" to start. 
  '''
    @app.route('/questions/search', methods=['POST'])
    def search_questions():
        return
    '''
  @TODO: 
  Create a GET endpoint to get questions based on category. 

  TEST: In the "List" tab / main screen, clicking on one of the 
  categories in the left column will cause only questions of that 
  category to be shown. 
  '''
    @app.route('/questions/<int:category_id>')
    def get_questions_by_category():
        return
    '''
  @TODO: 
  Create a POST endpoint to get questions to play the quiz. 
  This endpoint should take category and previous question parameters 
  and return a random questions within the given category, 
  if provided, and that is not one of the previous questions. 

  TEST: In the "Play" tab, after a user selects "All" or a category,
  one question at a time is displayed, the user is allowed to answer
  and shown whether they were correct or not. 
  '''
    @app.route('/questions/play', methods=['POST'])
    def get_random_question():
        return

    '''
  @TODO: 
  Create error handlers for all expected errors 
  including 404 and 422. 
  '''
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            "success": False,
            "error": str(error)
        }), 404

    @app.errorhandler(422)
    def unprocessable_entity(error):
        return jsonify({
            "success": False,
            "error": str(error)
        }), 422

    @app.errorhandler(500)
    def server_error(error):
        return jsonify({
            "success": False,
            "error": str(error)
        }), 500

    return app


if __name__ == "__main__":
    app.run()
