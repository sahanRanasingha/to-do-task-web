from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Task

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.filter_by(completed=False).order_by(Task.created_at.desc()).limit(5).all()
    return jsonify([{
        'id': task.id,
        'title': task.title,
        'description': task.description
    } for task in tasks])

@app.route('/api/tasks', methods=['POST'])
def add_task():
    data = request.get_json()
    new_task = Task(title=data['title'], description=data.get('description'))
    db.session.add(new_task)
    db.session.commit()
    return jsonify({'message': 'Task added'}), 201

@app.route('/api/tasks/<int:task_id>/done', methods=['PUT'])
def mark_done(task_id):
    task = Task.query.get_or_404(task_id)
    task.completed = True
    db.session.commit()
    return jsonify({'message': 'Task marked as done'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
