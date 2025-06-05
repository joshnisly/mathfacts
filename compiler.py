#!/usr/bin/env python3

import json
import os
import threading
import time

import dukpy

def start_compile_thread(input_dirs, output_dir):
    threading.Thread(target=compile_forever, args=(input_dirs, output_dir), daemon=True).start()


def compile_forever(input_dirs, output_dir):
    file_stats = {}
    while True:
        time.sleep(0.25)

        try:
            _compile_once(input_dirs, output_dir, file_stats)
        except Exception:
            pass


def _compile_once(input_dirs, output_dirs, file_stats):
    for input_dir, output_dir in zip(input_dirs, output_dirs):
        for root, dirs, files in os.walk(input_dir):
            for file_name in files:
                full_path = os.path.join(root, file_name)
                output_name = file_name.replace('.jsx', '.js')
                target_path = os.path.join(output_dir, output_name)
                mtime = os.stat(full_path).st_mtime
                if mtime != file_stats.get(full_path):
                    if not os.path.exists(target_path) or mtime > os.stat(target_path).st_mtime:
                        _compile_file(full_path, target_path)
                    file_stats[full_path] = mtime


def _compile_file(input_path, output_path):
    print('Compiling %s...' % input_path)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    try:
        with open(output_path, 'w') as output:
            output.write(dukpy.jsx_compile(open(input_path).read()))
    except Exception as e:
        with open(output_path, 'w') as output:
            error_text = 'window.alert("Compile failed: " + ' + json.dumps(str(e)) + ');'
            output.write(error_text)


def main():
    our_dir = os.path.dirname(os.path.abspath(__file__))
    _compile_once([os.path.join(our_dir, 'static/jsx')], [os.path.join(our_dir, 'static/compiled')],
                  {})


if __name__ == '__main__':
    main()
