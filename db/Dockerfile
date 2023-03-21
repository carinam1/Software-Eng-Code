FROM postgres:14
COPY postgres.conf /etc/postgresql/postgresql.conf
COPY db-seed-files/ /etc/docker-entrypoint-initdb.d/
CMD ["-c", "config_file=/etc/postgresql/postgresql.conf"]

#docker run -d --name nuyu_db -p 5432:5432 -e POSTGRES_PASSWORD=password -v postgres:$HOME/nuyu/db postgres:14
