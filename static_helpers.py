#!/usr/bin/env python3

import os

import flask


def init(app):
    app.add_template_filter(version_filter, 'version')
    app.add_url_rule('/static/<path:filename>', endpoint='static', view_func=static)
    app.add_url_rule('/static/<int:version>/<path:filename>', endpoint='static', view_func=static)


def static(filename, version=None):
    return flask.send_from_directory(_STATIC_ROOT, filename)


def version_filter(s):
    assert s.startswith('/static/')
    path = '/'.join(s.split('/')[2:])
    return '/static/%i/%s' % (_get_file_version(path), path)


def _get_file_version(rel_path):
    full_path = os.path.join(_STATIC_ROOT, rel_path)
    if not os.path.exists(full_path):
        return 0

    return os.stat(full_path).st_mtime

_STATIC_ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static')
