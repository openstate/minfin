#!/usr/bin/env python
# -*- coding: utf-8 -*-

# Script that does more clean up on begrotingsstaten_first_step.csv and
# writes the output to another .csv called
# 'begrotingsstaten.csv' and the directory
# 'begrotingsstaten_json' which contains a .json file holding the values
# in a nested way for each combination of year,
# uitgaven (U)/verplichtingen (V)/ontvangsten (O) and type of budget
# (i.e., ontwerpbegroting/vastgestelde_begroting/
# eerste_suppletoire_begroting/tweede_suppletoire_begroting/realisatie).
# The .json files are hierarchically structured in the format used for
# hierarchical visualisations by D3.js
# (https://github.com/d3/d3-hierarchy/blob/master/README.md#hierarchy).


import csv, codecs, cStringIO
import json
import os
import re
from collections import defaultdict

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

class UnicodeWriter:
    """
    A CSV writer which will write rows to CSV file "f",
    which is encoded in the given encoding.
    """

    def __init__(self, f, dialect=csv.excel, encoding="utf-8", **kwds):
        # Redirect output to a queue
        self.queue = cStringIO.StringIO()
        self.writer = csv.writer(self.queue, dialect=dialect, **kwds)
        self.stream = f
        self.encoder = codecs.getincrementalencoder(encoding)()

    def writerow(self, row):
        self.writer.writerow([s.encode("utf-8") for s in row])
        # Fetch UTF-8 output from the queue ...
        data = self.queue.getvalue()
        data = data.decode("utf-8")
        # ... and reencode it into the target encoding
        data = self.encoder.encode(data)
        # write to the target stream
        self.stream.write(data)
        # empty queue
        self.queue.truncate(0)

    def writerows(self, rows):
        for row in rows:
            self.writerow(row)


# Remove '.' thousand separator from a value (e.g., 1.000,00 becomes
# 1000,00)
def remove_separator(value):
    return re.sub('\.', '', value)

# Mapping of hoofdstuk indicator to the name of the hoofdstuk
mapping = {
    "A": "Infrastructuurfonds",
    "B": "Gemeentefonds",
    "C": "Provinciefonds",
    "F": "Diergezondheidsfonds",
    "H": "BES-fonds",
    "I": "De Koning",
    "IIA": "De Staten Generaal",
    "IIB": "Overige Hoge Colleges van Staat",
    "III": "Algemene Zaken",
    "IV": "Koninkrijksrelaties",
    "IXA": "Nationale Schuld",
    "IXB": u"Financiën",
    "J": "Deltafonds",
    "V": "Buitenlandse Zaken",
    "VII": "Binnenlandse Zaken en Koninkrijksrelaties",
    "VIII": "Onderwijs, Cultuur en Wetenschap",
    "VI": "Veiligheid en Justitie",
    "X": "Defensie",
    "XIII": "Economische Zaken",
    "XII": "Infrastructuur en Milieu",
    "XVII": "Buitenlandse Handel & Ontwikkelingssamenwerking",
    "XVIII": "Wonen en Rijksdienst",
    "XVI": "Volksgezondheid, Welzijn en Sport",
    "XV": "Sociale Zaken en Werkgelegenheid"
}

# Set up the datastructure for the .json output files
tree = lambda: defaultdict(tree)
dict_data = tree()

# Open the .csv file to write to
with open('begrotingsstaten.csv', 'w') as OUT:
    writer = UnicodeWriter(OUT)
    # Open the .csv file to read from
    with open('begrotingsstaten_first_step.csv') as IN:
        data = UnicodeReader(IN)
        # Retrieve the first line containing the column names
        column_names = data.next()
        # Write the first line containing the column lines to the .csv
        # file. Columns B, C and M are removed as they always contain
        # the same value and a column called 'Begrotingsstaat
        # omschrijving' is added to separate the information from column
        # E ('Begrotingsstaat code' and 'Begrotingsstaat omschrijving')
        # into two columns.
        writer.writerow(
            [
                column_names[0],
                column_names[3],
                column_names[4],
                u'Begrotingsstaat omschrijving',
                column_names[5],
                column_names[6],
                column_names[7],
                column_names[8],
                column_names[9],
                column_names[10],
                column_names[11]
            ]
        )

        # Process each line of the input data
        for line in data:
            # Skip these lines as they contain aggregate values
            if line[4] == 'Rijk':
                continue
            if line[6] == 'TOTAAL':
                continue

            # Read the data from the columns of the current line
            year = line[0]
            # Whether the values are for uitgaven (U),
            # verplichtingen (V) or ontvangsten (O)
            uvo = line[3]
            # Only extract the 'begrotingsstaat_code' from this column
            begrotingsstaat_code = line[4].split(',')[0].upper()
            # Retrieve 'begrotingsstaat_omschrijving' from the mappnig
            begrotingsstaat_omschrijving = mapping[begrotingsstaat_code]
            artikel_code = line[5]
            artikel_omschrijving = line[6]
            # Remove any thousands separators from the values
            ontwerpbegroting = remove_separator(line[7])
            vastgestelde_begroting = remove_separator(line[8])
            eerste_suppletoire_begroting = remove_separator(line[9])
            tweede_suppletoire_begroting = remove_separator(line[10])
            realisatie = remove_separator(line[11])

            # Save the current line in the nested structure used to
            # create the .json files
            dict_data[year][uvo]['ontwerpbegroting'][begrotingsstaat_omschrijving][artikel_omschrijving] = ontwerpbegroting
            dict_data[year][uvo]['vastgestelde_begroting'][begrotingsstaat_omschrijving][artikel_omschrijving] = vastgestelde_begroting
            dict_data[year][uvo]['eerste_suppletoire_begroting'][begrotingsstaat_omschrijving][artikel_omschrijving] = eerste_suppletoire_begroting
            dict_data[year][uvo]['tweede_suppletoire_begroting'][begrotingsstaat_omschrijving][artikel_omschrijving] = tweede_suppletoire_begroting
            dict_data[year][uvo]['realisatie'][begrotingsstaat_omschrijving][artikel_omschrijving] = realisatie

            # Write the current line to the .csv file
            writer.writerow(
                [
                    year,
                    uvo,
                    begrotingsstaat_code,
                    begrotingsstaat_omschrijving,
                    artikel_code,
                    artikel_omschrijving,
                    ontwerpbegroting,
                    vastgestelde_begroting,
                    eerste_suppletoire_begroting,
                    tweede_suppletoire_begroting,
                    realisatie
                ]
            )

# Directory name to save the .json files in
dirname = 'begrotingsstaten_json'
# Create the directory if it does not exist
if not os.path.exists(dirname):
    os.mkdir(dirname)

# Loop over each combination of year, uvo and budget_type
for year, year_values in dict_data.iteritems():
    for uvo, uvo_values in year_values.iteritems():
        for budget_type, budget_type_values in uvo_values.iteritems():
            # Open a .json file for this combination of year, uvo and
            # budget_type to write to
            filename = '%s-%s-%s' % (year, uvo, budget_type)
            with open('%s/%s.json' % (dirname, filename), 'w') as OUT:
                # Add dicts of all begrotingsstaat omschrijvingen and
                # their lists of artikelen to a list (1st level)
                begrotingsstaat_list = []
                for begrotingsstaat_omschrijving, begrotingsstaat_values in budget_type_values.iteritems():
                    # Add dicts of all artikel omschrijvingen and their
                    # values to a list (2nd level)
                    artikel_list = []
                    for artikel_omschrijving, value in begrotingsstaat_values.iteritems():
                        artikel_list.append(
                            {
                                "name": artikel_omschrijving,
                                "size": value
                            }
                        )
                    begrotingsstaat_list.append(
                        {
                            "name": begrotingsstaat_omschrijving,
                            "children": artikel_list
                        }
                    )
                # Create a top level containing the list of
                # begrotingsstaten
                out_data = {
                    "name": filename,
                    "children": begrotingsstaat_list
                }

                # Save the data to a .json file
                json.dump(out_data, OUT, indent=4)
