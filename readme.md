# Тестирование сервера в многопоточном и однопоточном режимах

## Node JS

В этом приложении используется Node JS `20.11.1` + библиотека `express`

## Docker

Для удобства деплоя используется Docker и Docker compose

## Nginx

Для эмуляции продакшн приложения, запускается Nginx для проксирования запросов к бэкэнду

## Команды для тестирования

```sh
# один экземпляр
docker-compose up --build

# 4 экземпляра
APP_INSTANCES=4 CPU_LIMIT=0.95 MEMORY_LIMIT=2G docker-compose up --build --scale app=4
```
