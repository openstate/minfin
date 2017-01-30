# This shell script cleans up begrotingsstaten.csv as published in Septembre 2016 on http://opendata.rijksbegroting.nl/#dataset_1

# It is developed and tested on Ubuntu 14.04 and requires csvkit (install using `sudo pip install csvkit`; more info: https://csvkit.readthedocs.io/en/1.0.1/tutorial/1_getting_started.html#installing-csvkit)

# Simply place begrotingsstaten.csv in the same directory as this script and run `./begrotingsstaten_first_fixes.sh`. This will produce a cleaned up file called `begrotingsstaten_first_fixes.csv`.


# Open the tab-separated begrotingsstaten.csv using the latin1 encoding (not all is latin1 encoded, but they are fixed in later commands)
csvcut -d ';' -e 'latin1' begrotingsstaten.csv |
# Replace question mark with ë for the words Financi?n and materi?le
sed 's/Financi?n/Financiën/g' |
sed 's/materi?le/materiële/g' |
# The ç in Curaçao is formatted in different ways, so replace it with a ç
sed 's/Kabinet van de Gouverneur van Cura[^,]*/Kabinet van de Gouverneur van Curaçao/g' |
# The lines 2285-2290 and 2231 contain wrong values in columns D and E
sed -r 's/2016,Euro,x1000,U,O,(.),/2016,Euro,x1000,O,J,\1,/g' |
sed -r 's/2016,Euro,x1000,U,V,([0-9]),/2016,Euro,x1000,V,J,\1,/g' |
sed 's/2016,Euro,x1000,U,V,-,TOTAAL,1624643/2016,Euro,x1000,V,J,-,TOTAAL,1624643/' |
# Remove some lines which are mostly empty (2313, 2314 and 2660)
sed '/,,,,,,,,/d' |
# Lines 2703-2705 have a missing value in column F
sed 's/2017,Euro,x1000,V,I,-,Uitkering leden Koninklijk Huis/2017,Euro,x1000,V,I,1,Uitkering leden Koninklijk Huis/' |
sed 's/2017,Euro,x1000,V,I,-,Functionele uitgaven van de Koning/2017,Euro,x1000,V,I,2,Functionele uitgaven van de Koning/' |
sed 's/2017,Euro,x1000,V,I,-,Doorbelaste uitgaven van andere begrotingen/2017,Euro,x1000,V,I,3,Doorbelaste uitgaven van andere begrotingen/' |
# Remove the last 4 lines which don't contain any actual data and save the output in a file called begrotingsstaten_first_fixes.csv
head -n-4 > begrotingsstaten_first_fixes.csv
