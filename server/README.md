SECexplorer server
============

Setup (development and production)
-----

The flask-based server depends on several python packages. It's best to create
a virtual environment so that packages are not installed into the global python
environment where they might be cause version conflicts with other python
applications.

    $ pip install virtualenvwrapper
    $ cd server
    $ mkvirtualenv secexplorer  # create the virtual environment
    $ workon secexplorer  # activate the virtual environment

Now the dependencies can be installed:

    $ pip install -r requirements.txt

For more information refer to: [](https://virtualenvwrapper.readthedocs.org/en/latest/).

Development workflow
--------------------

To respond to API requests from the client a development server process can be
started by executing the `wsgi.py` file.

    $ workon secexplorer
    $ python wsgi.py

This development server automatically reloads all python code as soon as a file
changes. Furthermore, debugging is easily done by using *pdb*.
To this end, like in a normal python application, just place the statements `import ipdb; ipdb.set_trace()`
anywhere you like.

### Installing libraries

    $ workon secexplorer
    $ pip install SOMELIB && pip freeze > requirements.txt

Production
----------

The flask application should be used in combination with a server like
[uwsgi](https://uwsgi-docs.readthedocs.org/en/latest/).

Starting uWSGI might look like this:

    $ uwsgi --http :8020 --wsgi wsgi:app --master --processes 2 --threads 5 --stats 127.0.0.1:5003 -H ~/.virtualenvs/secexplorer

Configuring uWSGI as a service and setting appropriate configurations in a config file is preferred. 
uWSGI should be coupled to nginx running on port 80 s.t. all requests prepended
with `/api` are proxied to uWSGI running on port 8020 or similar.
