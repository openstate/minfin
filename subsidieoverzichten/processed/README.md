#Dataset 2: Subsidieoverzichten 2013, 2014, 2015.

Overzicht van subsidie(-regelingen), subsidieontvangers en de daarbij behorende bedragen, per artikel van de departementale begrotingen.

Bron: http://opendata.rijksbegroting.nl/#dataset_2

1. Namen departmenten zijn consistent doorgevoerd.
2. Beleidsartikelnummers zijn gecorrigeerd door het hoofdartikel nummer en de daaraan gekoppelde naam consistent te gebruiken.
3. Kolom toegevoegd begrotingshoofdstukken (Romeinse cijfer en namen) en begrotingsjaar.
4. Bedragen worden aangeduid x1000 - daar waar dat niet zo was is gecorrigeerd. (Economische Zaken, 2013, rij 59-107 tabblad Art 17) [http://opendata.rijksbegroting.nl/subsidieoverzicht_ez_2013.xlsx](http://opendata.rijksbegroting.nl/subsidieoverzicht_ez_2013.xlsx)
5. 133 rijen met lege velden voor ontvangers in het subsidieoverzicht VWS 2013 zijn ingevuld met "natuurlijk persoon of v.o.f." [http://opendata.rijksbegroting.nl/subsidieoverzicht_vws_2013.xlsx](http://opendata.rijksbegroting.nl/subsidieoverzicht_vws_2013.xlsx)
6. Karakterencoding UTF8.
7. In 2013 ontbreekt subsidieoverzicht Defensie.

"departement","subsidieregeling","beleidsartikel","artikel_nummer","naam_ontvanger","uitgekeerd_bedrag","begrotingsjaar","begrotings_hoofstuk","begrotings_staat"

Naam ministerie	Naam beleidsartikel / subsidie(regeling)	Artikel- nummer	Naam ontvanger	Uitgekeerd bedrag subsidie(regeling) per eindontvanger

| opendata.rijksbegroting                                 | subsidieoverzichten.cvs | 
| --------------------------------------------------------|------------------------:| 
| naam ministerie                                         | departement             |
| naam beleidsartikel                                     | beleidsartikel          |  
| subsidie(regeling)                                      | subsidieregeling        |
| artikel nummer                                          | artikel_nummer          |
| naam ontvanger                                          | naam_ontvanger          |
| uitgekeerd bedrag subsidie(regeling) per eindontvanger  | uitgekeerd_bedrag       |
|---------------------------------------------------------|                         |
| `toegevoegd`                                            | begrotingsjaar          |
|                                                         | begrotings_hoofdstuk    |
|                                                           begrotings_staat        |
