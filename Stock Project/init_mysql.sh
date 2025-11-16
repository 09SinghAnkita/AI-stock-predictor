#!/bin/bash
set -euo pipefail

sudo service mysql start || true

if [ -f /etc/mysql/debian.cnf ]; then
  # Codespaces/Ubuntu
  AUTH_CMD=(sudo mysql --defaults-file=/etc/mysql/debian.cnf)
elif [ -n "${MYSQL_ROOT_PASSWORD:-}" ]; then
  # Local MySQL with root password set
  AUTH_CMD=(mysql -u root -p"${MYSQL_ROOT_PASSWORD}")
else
  # Local MySQL with socket/no password
  AUTH_CMD=(mysql -u root)
fi

"${AUTH_CMD[@]}" <<SQL
CREATE DATABASE IF NOT EXISTS \`${DB_NAME:-stock_db}\`;
CREATE USER IF NOT EXISTS '${DB_USER:-django_user}'@'%' IDENTIFIED BY '${DB_PASSWORD:-django_pass}';
GRANT ALL PRIVILEGES ON \`${DB_NAME:-stock_db}\`.* TO '${DB_USER:-django_user}'@'%';
FLUSH PRIVILEGES;
SQL

echo "✅ MySQL ready with database ${DB_NAME:-stock_db}"

