from flask import Blueprint, render_template, request, flash
auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['GET', 'POST'])
def login():
    data = request.form
    print(data)
    return render_template("login.html", boolean=True)

@auth.route('/logout')
def logout():
    return"<p>Logout</p>"

@auth.route('/sign-up', methods=['GET', 'POST'])
def sign_up():
    if request.method == 'POST':
        email = request.form.get('email')
        nickName = request.form.get('nickName')
        password1 = request.form.get('password1')
        password2 = request.form.get('password2')

        if len(email) < 4:
            flash('Email must be greater than 3 charcters.', category='error')
        elif len(nickName) < 2:
            flash('Призвісько мусить бути більше ніж 1 буква', category='error')
        elif password1 != password2:
            flash('Password are different', category='error')
        elif len(password1) < 7:
            flash('Password is too small', category='error')
        else:
            flash('You are in', category='success')

    return render_template(("sign_up.html"))