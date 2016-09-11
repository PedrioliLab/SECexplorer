SECexplorer
===========

SECexplorer is a web interface to the *R* package SECprofiler.

This project consists of two parts:

- The `client/` folder contains a javascript-based frontend making use of the framework
  [angularjs](https://angularjs.org/).

- A `server/` folder holds the python-based backend server based on
  [flask](http://flask.pocoo.org/).  This backend in uses `rpy2` to execute the functions from the
  `SECprofiler´R package.


How is the web server setup ?
-----------------------------

The client runs a `nodejs` server on port 80 which currently only serves the `index.html` file plus
the referenced static java script and css files.

The backend Python server is implemented with `flask`. Apache listens on port 8020 and forwards
requests to `flask` using `mod_wsgi`.

We implemented a unit file `sec_explorer.server` for `systemd` for proper startup and shutdown of
this processes. More details below.



How to setup and install the web server
=========================

**First read the `client/README.md` file for installing `nodejs` and the requires javascript 
packages.**

**Furter check the installation instructions in the `SECprofiler` package. This `R` package must be
accesssible by `rpy2` within the Python backend.**


*The following instructions where developed and tested on `Ubuntu 16.04.1 LTS`. They should work for
new versions as well, but might break on older versions as `systemd` was not default system manager
before `Ubuntu 15.04`.*

To install the `sec_explorer.service` file and to configure apache  we assume that your current
working directory is the one holding this `README.md` file. Then run:

```bash
$ sudo ln -s $(pwd)/sec_explorer.service /lib/systemd/system
$ sudo ln -s $(pwd)/for_apache.conf /etc/apache2/conf-enabled/sec-explorer.conf
$ sudo systemctl enable sec_explorer.service
```



Development on the web server setup
==================================

In case you edit the `sec_explorer.service` file you first have to reload it:
```bash
$ sudo systemctl daemon-reload
```


How to start / stop the web server
=========================

```bash
$ sudo systemctl start sec_explorer.service
```

```bash
$ sudo systemctl stop sec_explorer.service
```
