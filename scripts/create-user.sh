#!/bin/bash

declare -A users=(
  ["glpi"]="admin"
  ["post-only"]="user"
  ["tech"]="user"
  ["normal"]="user"
  ["glpi-system"]="user"
  ["Compras"]="user"
  ["Fiscal"]="user"
  ["Financeiro"]="user"
)

for name in "${!users[@]}"; do
  permissions=${users[$name]}

  curl --location 'http://192.168.2.15:8000/user' \
  --header 'Content-Type: application/json' \
  --data "{
    \"name\": \"$name\",
    \"permissions\": \"$permissions\"
  }"
done
