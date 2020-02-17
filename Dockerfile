FROM node:latest
# Copy and build server
COPY . /home/craft/note-app-frontend
WORKDIR /home/craft/
RUN cd note-app-frontend \
    && npm install \
    && npm run build

FROM nginx:latest

COPY --from=0 /home/craft/note-app-frontend/dist/note-app-frontend /var/www/html
COPY ./docker/nginx-default.conf.template /etc/nginx/conf.d/default.conf.template
COPY ./docker/docker-entrypoint.sh /

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
