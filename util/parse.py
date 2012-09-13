#! /usr/bin/env python
import json
import os
f = open(os.path.join(os.path.dirname(__file__), 'zones.txt'))
a = {}
for l in f:
    s = l.replace(' ', '').replace('\n', '').split(',')
    d = s[0]
    if len(s) == 1:
        e = 0.0
    else:
        e = float(s[1])
    a[d] = e

f2 = open(os.path.join(os.path.dirname(__file__), '../extension/zones.json'), 'w')

f2.write(json.dumps(a, indent=4))
