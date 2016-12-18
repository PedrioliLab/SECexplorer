import sys
import os

here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)

from secexplorer.appfactory import create_app

application = create_app({})
