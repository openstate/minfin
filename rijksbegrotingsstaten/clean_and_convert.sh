# This shell script first runs two other scripts which perform all cleanup and conversions of begrotingsstaten.csv as published in September 2016 on http://opendata.rijksbegroting.nl/#dataset_1
# Make sure this file is available in the current directory and renamed to `begrotingsstaten_origineel.csv`.
# The output of this script is a file called `begrotingsstaten.csv`

# Run the Shell script
./cleanup_first_step.sh
# Run the Python script
./cleanup_second_step.py
# Remove the output file from the Shell script as it is no longer necessary
rm begrotingsstaten_first_step.csv
