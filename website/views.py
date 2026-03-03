from flask import Blueprint, render_template, request, flash, jsonify
from flask_login import login_required, current_user
from .models import Note, Timer
from . import db
import json, random, os, time, datetime
from threading import Thread
from datetime import datetime

views = Blueprint('views', __name__)

@views.route('/', methods=['GET', 'POST'])
@login_required
def home():
    if request.method == 'POST':
        note = request.form.get('note')

        if len(note) < 1:
            flash('Note is too short!', category='error')
        else:
            new_note = Note(data=note, user_id=current_user.id)
            db.session.add(new_note)
            db.session.commit()
            flash('Note is added!', category='success')
    return render_template("home.html", user=current_user)

@views.route('/delete-note', methods=['POST'])
def delete_note():
    note = json.loads(request.data)
    noteId = note['noteId']
    note = Note.query.get(noteId)
    if note:
        if note.user_id == current_user.id:
            db.session.delete(note)
            db.session.commit()

    return jsonify({})

@views.route('/stopwatches')
@login_required
def start_stopwatch():
    return render_template("stopwatches.html")


@views.route('/api/timers', methods=['GET','POST'])
@login_required
def timers():
    if request.method == 'POST':
        data = request.get_json()
        name = data.get('name')
        color = data.get('color')
        user_id = current_user.id

        if not name or len(name) < 1:
            return jsonify({"error": "Name is too small"}), 400
        elif not color or len(color) < 2:
            return jsonify({"error": "Color is too smal"}), 400
        else:
            new_timer = Timer(name=name, color=color, user_id=user_id)
            db.session.add(new_timer)
            db.session.commit()
            return jsonify({"message": "Timer created"}), 201
    elif request.method == 'GET':
        timers = Timer.query.filter_by(user_id=current_user.id).all()
        timers_data = []
        for timer in timers:
            timers_data.append({
                'id': timer.id,
                'name': timer.name,
                'color': timer.color,
                'elapsed_time': timer.elapsed_time,
                'is_running': timer.is_running,
                'start_time': timer.start_time.isoformat() if timer.start_time else None
            })
        return jsonify(timers_data), 200


@views.route('/api/timers/<id>/start', methods=['POST'])
@login_required
def start_timer(id):
    if request.method == 'POST':
        timer = Timer.query.get(int(id))

        if not timer or timer.user_id != current_user.id:
            return jsonify({"error": "Not allowed"}), 403

        timers = Timer.query.filter_by(user_id=current_user.id, is_running=True).all()

        for t in timers:
            if t.start_time != None:
                t.elapsed_time += int((datetime.utcnow() - t.start_time).total_seconds())
            t.is_running = False
            t.start_time = None

        timer.is_running = True
        timer.start_time = datetime.utcnow()

        db.session.commit()
        return jsonify({"message": "Timer started"}), 200



@views.route('/api/timers/<id>/pause', methods=['POST'])
@login_required
def pause_timer(id):
    if request.method == 'POST':
        timer = Timer.query.get(int(id))
        if timer and timer.user_id == current_user.id:
            if timer.is_running:
                timer.is_running = False
                timer.elapsed_time += int((datetime.utcnow() - timer.start_time).total_seconds())
                timer.start_time = None
            db.session.commit()
            return jsonify({"message": "Timer paused"}), 200
        else:
            return jsonify({"error": "Not allowed"}), 403


@views.route('/api/timers/<id>', methods=['DELETE'])
@login_required
def delete_timer(id):
    if request.method == 'DELETE':
        timer = Timer.query.get(int(id))
        if timer and timer.user_id == current_user.id:
            db.session.delete(timer)
            db.session.commit()
            return jsonify({"message": "deleted"}), 200
        else:
            return jsonify({"error": "Not allowed"}), 403

