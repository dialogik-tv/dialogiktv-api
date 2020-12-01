#!/bin/sh

DOCKER_NETWORK=dialogiktv-api
MYSQL_PASSWORD=root
MYSQL_DATABASE=dtv_api

if [[ $1 == "" ]]; then
    echo "No command was given. The following commands are available: build, start, stop"
    echo "Example: $0 build"
    exit 1
fi

case $1 in
    "build")
        echo "Building Docker image"
        docker build -t dialogiktv/api . ;;
    "start")
        echo "Creating the Docker network"
        docker network create $DOCKER_NETWORK

        echo "Starting MySQL server"
        docker run --detach --name mysql --network $DOCKER_NETWORK -e MYSQL_ROOT_PASSWORD=$MYSQL_PASSWORD -e MYSQL_DATABASE=$MYSQL_DATABASE -p 3306:3306 mysql:5.7.32

        echo "Waiting two minutes to let the MySQL server start"
        sleep 120
        
        echo "Starting up the API"
        docker run --interactive --tty --name dialogiktv-api --network $DOCKER_NETWORK -p 3000:3000 -e DB_ENGINE=mysql -e DB_HOST=mysql -e DB_USER=root -e DB_PASSWORD=$MYSQL_PASSWORD -e DB_DATABASE=$MYSQL_DATABASE -e HOST=0.0.0.0 -e PORT=3000 dialogiktv/api ;;
    "stop")
        echo "Stopping and removing the MySQL container"
        docker stop mysql
        docker rm mysql

        echo "Stopping and removing the API container"
        docker stop dialogiktv-api
        docker rm dialogiktv-api

        echo "Removing the Docker network"
        docker network rm $DOCKER_NETWORK ;;
    *)
        echo "Invalid command given: $1"
        echo "The following commands are available: build, start, stop"
        exit 1;;
esac

