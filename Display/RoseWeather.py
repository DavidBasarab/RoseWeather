import sys
from PyQt4.QtCore import *
from PyQt4.QtGui import *
from PyQt4.QtWebKit import *
import urllib
import time


class Window(QWidget):
    def __init__(self, url):
        super(Window, self).__init__()
        view = QWebView(self)
        layout = QVBoxLayout(self)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.addWidget(view)

        html = urllib.urlopen(url).read()
        view.setHtml(html)
        #self.close()


def main(url):
    app = QApplication(sys.argv)
    window = Window(url)
    window.showFullScreen()
    app.exec_()

main('index.html')