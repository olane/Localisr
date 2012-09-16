#! /usr/bin/env python
import json
import os
import math
f = open(os.path.join(os.path.dirname(__file__), 'zones.txt'))
a = {}
for l in f:
    s = l.replace(' ', '').replace('\n', '').split(',')
    d = s[0]

    if len(s) == 1:
        e = 0.0
    else:
        e = float(s[1])

    # string = ''
    # string += '+' if e >= 0 else '-'
    # string += '0' if math.fabs(e) < 10 else ''
    # string += str(int(math.fabs(e)))
    # n = math.fabs(e) - int(math.fabs(e))
    # if n == 0:
    #     string += '00'
    # elif n == 0.25:
    #     string += '15'
    # elif n == 0.5:
    #     string += '30'
    # elif n == 0.75:
    #     string += '45'

    a[d] = {
        'offset': e,
        # 'string': string
    }

f2 = open(os.path.join(os.path.dirname(__file__), '../extension/zones.json'), 'w')

f2.write(json.dumps(a, indent=4, sort_keys=True))
