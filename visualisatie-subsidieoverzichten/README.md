# Subsidie visualisatie
Bekijk en doorzoek alle subsidies van de rijksoverheid.

# Benodigde software
* [docker-compose](https://docs.docker.com/compose/install/)

# Installatie
* `cd docker`
* `sudo docker-compose up -d`
* `sudo docker exec -it docker_subsidies-app_1 python add_subs.py`
* Ga naar http://<ip address of docker_subsidies-nginx_1>/ (dit IP-adres is te achterhalen met `sudo docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' docker_subsidies-nginx_1`)

Alle docker containers herstarten automatisch, bijvorbeeld nadat de host herstart is.
