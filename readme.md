# Тестирование сервера в многопоточном и однопоточном режимах

## Node JS

В этом приложении используется Node JS `20.11.1` + библиотека `express`

## Docker

Для удобства деплоя используется Docker и Docker compose

## Nginx

Для эмуляции продакшн приложения, запускается Nginx для проксирования запросов к бэкэнду

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


# запуск одного экземпляра приложения
docker compose up --build -d

# 4 экземпляра
APP_INSTANCES=4 CPU_LIMIT=0.95 MEMORY_LIMIT=2G docker compose up --build --scale app=4
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
