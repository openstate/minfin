#!/usr/bin/env python
# -*- coding: utf-8 -*-

import csv, codecs, cStringIO
import json
import re

# Classes to read and write UTF-8 .csv's
class UTF8Recoder:
    """
    Iterator that reads an encoded stream and reencodes the input to UTF-8
    """
    def __init__(self, f, encoding):
        self.reader = codecs.getreader(encoding)(f)

    def __iter__(self):
        return self

    def next(self):
        return self.reader.next().encode("utf-8")

class UnicodeReader:
    """
    A CSV reader which will iterate over lines in the CSV file "f",
    which is encoded in the given encoding.
    """

    def __init__(self, f, dialect=csv.excel, encoding="utf-8", **kwds):
        f = UTF8Recoder(f, encoding)
        self.reader = csv.reader(f, dialect=dialect, **kwds)

    def next(self):
        row = self.reader.next()
        return [unicode(s, "utf-8") for s in row]

    def __iter__(self):
        return self

out_data = []

with open('subsidieoverzichten.csv') as IN, \
    open('subsidieoverzichten.json', 'w') as OUT:
    data = UnicodeReader(IN)
    data.next()
    for line in data:
        if line[6] == 'XIII':
            print line
        line_data = {}
        line_data['Regeling'] = line[1]
        line_data['Beleid'] = line[2]
        line_data['Ontvanger'] = line[4]
        line_data['Realisatie'] = re.sub(',', '', line[5])
        line_data['Jaar'] = line[6]
        line_data['Overheid'] = line[8]
        out_data.append(line_data)
    json.dump(out_data, OUT, indent=4)
