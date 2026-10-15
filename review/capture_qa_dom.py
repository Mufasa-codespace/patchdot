#!/usr/bin/env python3
"""Serialize generated pages for the dependency-free modeled-DOM QA harness."""
from html.parser import HTMLParser
from pathlib import Path
import json

VOID = set('area base br col embed hr img input link meta param source track wbr'.split())
class Capture(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = {'tag':'document','attrs':{},'text':'','tail':'','children':[]}
        self.stack=[self.root]
    def handle_starttag(self, tag, attrs):
        el={'tag':tag,'attrs':dict((k,'' if v is None else v) for k,v in attrs),'text':'','tail':'','children':[]}
        self.stack[-1]['children'].append(el)
        if tag not in VOID: self.stack.append(el)
    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID: self.handle_endtag(tag)
    def handle_endtag(self, tag):
        for i in range(len(self.stack)-1,0,-1):
            if self.stack[i]['tag']==tag:
                self.stack=self.stack[:i]
                return
    def handle_data(self,data):
        parent=self.stack[-1]
        if parent['children']: parent['children'][-1]['tail']+=data
        else: parent['text']+=data

D=Path(__file__).resolve().parent.parent/'dist'
result={}
for p in D.rglob('*.html'):
    parser=Capture();parser.feed(p.read_text())
    result[str(p.relative_to(D))]=parser.root['children'][0]
print(json.dumps(result))
