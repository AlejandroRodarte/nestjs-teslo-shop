#!/bin/sh

ROOT_DIR=/usr/share/nginx/html

Replace env vars in JavaScript files
echo "Replacing environment constants"
for file in $ROOT_DIR/assets/*.js;
do
  echo "Processing $file ...";
  sed -i 's|APP_VITE_APP_SERVER_API_VALUE|'${VITE_APP_SERVER_API}'|g' $file
done

exec "$@"
