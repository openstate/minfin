# Dataset 4a: Budgettaire tabellen

Budgettaire tabellen Rijksbegroting

Bron: http://opendata.rijksbegroting.nl/#dataset_4a

De gebruikte bestanden zijn:
- http://opendata.rijksbegroting.nl/budgettaire_tabellen.ods (2015)
- http://opendata.rijksbegroting.nl/budgettaire_tabellen_owb_2016.ods
- http://opendata.rijksbegroting.nl/budgettaire_tabellen_owb_2017.ods

Alle bovenstaande bestanden hebben '_origineel' toegevoegd gekregen aan de naam en zijn omgezet naar .csv bestanden, bijvoorbeeld `budgettaire_tabellen_owb_2017_origineel.csv`. Voor de consistentie is het bestand uit 2015, `budgettaire_tabellen.ods`, hier hernoemd naar `budgettaire_tabellen_owb_2015.csv`. De door het script opgeschoonde .csv's worden opgeslagen als `budgettaire_tabellen_owb_201X.csv` (waar `X` het jaartal is). Ook wordt de data hiërarchisch opgeslagen als .json bestanden volgens de [structuur voor hiërarchische visualisaties van D3.js](https://github.com/d3/d3-hierarchy/blob/master/README.md#hierarchy) in de folder `budgettaire_tabellen_json`. Er is een .json bestand voor elke combinatie van jaar, uitgaven (U)/verplichtingen (V)/ontvangsten (O) en de type begroting (ontwerpbegroting/vastgestelde_begroting/eerste_suppletoire_begroting/tweede_suppletoire_begroting/realisatie).

Mocht je zelf de  en conversie scripts uit willen voeren dan hoef je enkel `convert_budgettaire_tabellen.py` uit te voeren: `./convert_budgettaire_tabellen.py`

Alle opschoningstaken zijn gedocumenteerd in de code van de scripts (samen met de rijnummers in de .csv als de opschoning op specifieke regels van toepassing is).
