# Тестирование сервера в многопоточном и однопоточном режимах

## Node JS

В этом приложении используется Node JS `20.11.1` + библиотека `express`

## Docker

Для удобства деплоя используется Docker и Docker compose

## Nginx

Для эмуляции продакшн приложения, запускается Nginx для проксирования запросов к бэкэнду

## Конфигурация VM

| Параметр | Значение          |
| -------- | ----------------- |
| CPU      | 6                 |
| RAM      | 10                |
| SSD      | 20                |
| OS       | Almalinux minimal |
| Docker   | Latest            |

## Команды для тестирования

```sh
# установка docker
sudo dnf remove docker \
        docker-client \
        docker-client-latest \
        docker-common \
        docker-latest \
        docker-latest-logrotate \
        docker-logrotate \
        docker-engine

sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo dnf install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl start docker
sudo systemctl enable docker

# инициализация swarm
docker swarm init

docker config create nginx_conf ./nginx.conf

# билд образа
docker build -t server-test .

# запуск одного экземпляра приложения
APP_INSTANCES=1 MEMORY_LIMIT=1G docker stack deploy -c docker-compose.stack.yml mystack

# остановка swarm
docker stack rm mystack
# подождать секунд 5

# 4 экземпляра
docker swarm init
APP_INSTANCES=4 CPU_LIMIT=0.95 MEMORY_LIMIT=2G docker stack deploy -c docker-compose.stack.yml mystack

# статус сервисов
docker service ls

# проверка реплик
docker service ps mystack_app
```

## Тестирование autocannon

```sh
autocannon -c 200 -d 60 -p 10 -j http://localhost:3000 > results.json
# -c 200 - 200 одновременных соединений
# -d 60 - тест длится 60 секунд
# -p 10 - 10 секунд ожидания перед замерами (для стабилизации)
# -j - вывод в формате json
```

## Тестирование sysbench

```sh
# install sysbench
sudo dnf install sysbench

# CPU test
sysbench cpu --cpu-max-prime=20000 --threads=1 run

# Memory test
sysbench memory --memory-block-size=1K --memory-total-size=10G run

# File I/O test
sysbench fileio --file-total-size=3G prepare
sysbench fileio --file-total-size=3G --file-test-mode=rndrw --time=120 --max-requests=0 run

```

## Тестирование postgres

Установка [взята отсюда](https://www.postgresql.org/download/linux/redhat/)

```sh

# Install the repository RPM:
sudo dnf install -y https://download.postgresql.org/pub/repos/yum/reporpms/EL-9-x86_64/pgdg-redhat-repo-latest.noarch.rpm

# Disable the built-in PostgreSQL module:
sudo dnf -qy module disable postgresql

# Install PostgreSQL:
sudo dnf install -y postgresql16-server

# Optionally initialize the database and enable automatic start:
sudo /usr/pgsql-16/bin/postgresql-16-setup initdb
sudo systemctl enable postgresql-16
sudo systemctl start postgresql-16

# Setup
sudo su - postgres
psql -c "ALTER USER postgres WITH PASSWORD '12345678';"
psql -c "CREATE DATABASE testing";
export PATH=$PATH:/usr/pgsql-16/bin

# Init testing db
pgbench -i -s 50 testing

# Testing
pgbench -c 10 -j 2 -T 60 testing

```
