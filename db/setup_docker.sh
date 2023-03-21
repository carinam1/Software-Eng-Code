docker run -d --name nuyu_db -p 5432:5432 -e POSTGRES_PASSWORD=password -v postgres:$HOME/nuyu/db postgres:14
