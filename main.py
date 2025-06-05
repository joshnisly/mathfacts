#!/usr/bin/env python3

import os
import sys

import flask

_OUR_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(_OUR_DIR)
import compiler
import static_helpers

application = flask.Flask(__name__, static_folder=None)
app = application  # For main.wsgi
app.config['TEMPLATES_AUTO_RELOAD'] = (__name__ == '__main__')
static_helpers._STATIC_ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static')
static_helpers.init(app)

@application.route('/')
def home():
    return flask.render_template('lesson.html', **{
    })


if __name__ == '__main__':
    our_dir = os.path.dirname(os.path.abspath(__file__))
    compiler.start_compile_thread([os.path.join(our_dir, 'static/jsx')],
                                  [os.path.join(our_dir, 'static/compiled')])
    application.run(debug=True)
