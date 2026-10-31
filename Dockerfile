FROM nginx:1.27-alpine

# The landing is plain HTML + CSS with no build step, so the image is only nginx
# plus the files. Keeping it buildless is the whole point: the source that ships
# is the source you can open by double-clicking.
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html

# Drop the repo plumbing from the served tree.
RUN rm -f /usr/share/nginx/html/Dockerfile \
          /usr/share/nginx/html/nginx.conf \
          /usr/share/nginx/html/.dockerignore \
          /usr/share/nginx/html/.gitignore

EXPOSE 80
