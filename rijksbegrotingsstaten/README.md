# Dataset 1: Rijksbegrotingsstaten

Een overzicht van uitgaven, verplichtingen en ontvangsten per artikel van de departementale begrotingen

Bron: http://opendata.rijksbegroting.nl/#dataset_1

[begrotingsstaten.csv](http://opendata.rijksbegroting.nl/begrotingsstaten.csv) (hier hernoemd naar `begrotingsstaten_origineel.csv`) wordt met deze scripts opgeschoond en opgeslagen als `begrotingsstaten.csv`. Ook wordt de data in de folder `begrotingsstaten_json` hiërarchisch opgeslagen als .json bestanden volgens de [structuur voor hiërarchische visualisaties van D3.js](https://github.com/d3/d3-hierarchy/blob/master/README.md#hierarchy). Er is een .json bestand voor elke combinatie van jaar, uitgaven (U)/verplichtingen (V)/ontvangsten (O) en de type begroting (ontwerpbegroting/vastgestelde_begroting/eerste_suppletoire_begroting/tweede_suppletoire_begroting/realisatie).

To run the cleanup and conversions yourself simply execute `clean_and_convert.sh` which will then run the other two scripts for you: `./clean_and_convert.sh`

All cleanup operations (and the corresponding line numbers if applicable) are documented in the code of the cleanup scripts.
