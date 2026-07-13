FROM nginx:1.27-alpine

COPY index.html /usr/share/nginx/html/
COPY .nojekyll /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets
