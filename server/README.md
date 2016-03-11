SECexplorer server
============

Setup
-----

    $ cd server
    $ mkvirtualenv secexplorer
    $ pip install -r requirements.txt

Development
-----------

Start development server:

    $ python wsgi.py

Production
----------

If started from the CLI something like:

    $ uwsgi --http :8020 --wsgi wsgi:app --master --processes 2 --threads 5 --stats 127.0.0.1:5003 -H ~/.virtualenvs/secexplorer

Configuring uWSGI as a service and setting appropriate configurations in a
config file is preferred. 
uWSGI should be coupled to nginx running on port 80 s.t. all requests prepended
with `/api` are proxied to uWSGI running on port 8020 or similar.
