echo "eliminando todas las imagenes..."
docker rmi -f $(docker images -aq)
echo "eliminando todas las redes..."
docker network prune
echo "eliminando todos los volumenes..."
docker volume rm $(docker volume ls -qf dangling=true)
echo "eliminando todo el cache, imagenes sin containers asociados, etc etc"
docker system prune -a

echo "Imagenes restantes..."
docker image ls

echo "Redes restantes.."
docker network ls
