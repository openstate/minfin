# Dataset 1: Rijksbegrotingsstaten

Een overzicht van uitgaven, verplichtingen en ontvangsten per artikel van de departementale begrotingen

Bron: http://opendata.rijksbegroting.nl/#dataset_1

[begrotingsstaten.csv](http://opendata.rijksbegroting.nl/begrotingsstaten.csv) (hier hernoemd naar `begrotingsstaten_origineel.csv`) wordt met deze scripts opgeschoond en opgeslagen als `begrotingsstaten.csv`. Ook wordt de data in de folder `begrotingsstaten_json` hiërarchisch opgeslagen als .json bestanden volgens de [structuur voor hiërarchische visualisaties van D3.js](https://github.com/d3/d3-hierarchy/blob/master/README.md#hierarchy). Er is een .json bestand voor elke combinatie van jaar, uitgaven (U)/verplichtingen (V)/ontvangsten (O) en de type begroting (ontwerpbegroting/vastgestelde_begroting/eerste_suppletoire_begroting/tweede_suppletoire_begroting/realisatie).

Mocht je zelf de cleanup en conversie scripts uit willen voeren dan hoef je enkel `clean_and_convert.sh` te draaien (dit script roept de andere twee scripts in deze folder zelf aan): `./clean_and_convert.sh`

Alle opschoningstaken zijn gedocumenteerd in de code van de scripts (samen met de rijnummers in de .csv als de opschoning op specifieke regels van toepassing is).
