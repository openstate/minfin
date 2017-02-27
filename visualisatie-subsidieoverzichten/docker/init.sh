# Generate a new secret key for Flask
echo "SECRET_KEY = '"`python -c 'import os; print os.urandom(24).encode("hex")'`"'" > ../app/settings.py

# Build and start all docker containers
sudo docker-compose up -d

sleep 10
# Import the subsidies from the .json file into Elasticsearch
sudo docker exec -it docker_subsidies-app_1 python add_subs.py

# Output the IP address of the Nginx container to view the tool
echo -en "\nBekijk de subsidietool op http://"
sudo docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' docker_subsidies-nginx_1
