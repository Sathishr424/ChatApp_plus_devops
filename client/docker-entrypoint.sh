#!/bin/sh

echo "Updating env.js file..."

cat > /usr/share/nginx/html/env.js <<EOF
window.__ENV__ = {
  API_URL: "${API_URL}",
  SOCKET_URL: "${SOCKET_URL}",
  STORAGE_URL: "${STORAGE_URL}"
};
EOF

echo "After updating the env.js file..."

cat /usr/share/nginx/html/env.js

exec nginx -g "daemon off;"
