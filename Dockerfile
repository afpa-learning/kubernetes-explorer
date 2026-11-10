FROM nginx:1.31.6-alpine

# Copie du dossier du site à héberger
COPY ./src /usr/share/nginx/html

# Modification des permissions pour les fichiers du site
RUN chmod -R a=rX /usr/share/nginx/html

# Exposition du port + protocol
EXPOSE 80/tcp

# Lancement du serveur
CMD ["nginx", "-g", "daemon off;"]
