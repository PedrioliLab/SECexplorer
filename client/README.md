# SECexplorer

## Development setup (OSX)

First, install node.js and its package manage `npm` via homebrew

    $ brew install nodejs

Now, the build tool `gulp` (a npm package) can be installed globally with `npm`. By
doing so gulp will readily be available on the command line.

    $ sudo npm install -g gulp

The build system depends on several other npm packages that are listed
as dependencies in the project description file `package.json`. They can easily
be installed by issuing the following commands:

    $ cd secexplorer/client
    $ npm install

## Client development workflow

The build process consists of several steps. Most notably these are:

- Packaging all javascript files using the tool *browserify*.
- Compiling the style files which are written in *LESS* to *CSS*.
- Starting a node-based development server that serves files and proxies
  API requests (prefixed with `/api` to the flask development server.

These tasks (and others) are automatically run when `gulp` is executed in the
client directory:

    $ cd secexplorer/client
    $ gulp

Furthermore, as soon as any LESS or JS file is changed, the build process
restarts automatically.
