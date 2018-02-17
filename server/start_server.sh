#!/bin/sh

at now<<EOL
python wsgi.py 2>&1 >log
EOL
