from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
import json
D=Path(__file__).parent/'dist'
errors=[]
class Check(HTMLParser):
 def __init__(self,path):super().__init__();self.path=path;self.h1=0;self.title=0;self.meta=False;self.form_actions=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='h1':self.h1+=1
  if tag=='title':self.title+=1
  if tag=='meta' and a.get('name')=='description':self.meta=bool(a.get('content'))
  if tag=='img' and 'alt' not in a:errors.append(f'{self.path}: missing alt')
  if tag=='form' and a.get('action'):errors.append(f'{self.path}: collecting form action present')
  for k in ['href','src']:
   u=a.get(k,'')
   if u.startswith('/') and not u.startswith('//'):
    dest=D/urlsplit(u).path.lstrip('/')
    if u.endswith('/') or not dest.suffix:dest=dest/'index.html'
    if not dest.exists():errors.append(f'{self.path}: broken asset or link {u}')
for path in D.rglob('*.html'):
 c=Check(path.relative_to(D));c.feed(path.read_text())
 if c.h1!=1:errors.append(f'{path}: {c.h1} h1 headings')
 if c.title!=1 or not c.meta:errors.append(f'{path}: SEO metadata missing')
 if 'noindex,nofollow' not in path.read_text():errors.append(f'{path}: preview noindex missing')
js=(D/'assets/app.js').read_text()
for forbidden in ['fetch(', 'XMLHttpRequest', 'localStorage', 'sessionStorage', 'sendBeacon', 'https://']:
 if forbidden in js:errors.append('Unexpected persistence or network behavior: '+forbidden)
result={'html_pages':len(list(D.rglob('*.html'))),'requested_pages':12,'status':'passed' if not errors else 'failed','errors':errors,'checks':['Internal links and asset paths','Single H1 and title per page','Meta description per page','Alt text on images','No collecting form action','No client persistence or network submission','Preview noindex on all pages']}
(Path(__file__).parent/'review/static-checks.json').write_text(json.dumps(result,indent=2));print(json.dumps(result,indent=2));raise SystemExit(bool(errors))
