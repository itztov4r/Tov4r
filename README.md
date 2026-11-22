# PICO WEB — Website & CMS

**Site principal :** https://pico-web-live-production.up.railway.app/  
**Administration :** https://pico-web-live-production.up.railway.app/admin  
**Ancien domaine GitHub Pages :** https://tov4r.xyz/ (redirige vers le site PICO WEB)

Ce dépôt remplace l'ancien site **TOV4R STUDIO** dans la branche `main`. Une sauvegarde complète de l'ancien site a été conservée sur la branche :

[backup-tov4r-before-pico-web-2026-11-22](https://github.com/itztov4r/Tov4r/tree/backup-tov4r-before-pico-web-2026-11-22).

## Architecture

- `index.html` : redirection du site GitHub Pages vers le site PICO WEB en ligne.
- `admin/index.html` : redirection vers l'espace administrateur PICO CMS.
- `404.html` : redirige les anciennes URL vers Railway.
- `server/index.tsx` : **source complète de l'application Bun sur Railway**, avec site, produits Amazon, comparateur, reviews, blog, favoris et CMS (route `/admin`).
- `CNAME` : domaine personnalisé de GitHub Pages, actuellement `tov4r.xyz`.

### Pourquoi GitHub Pages redirige ?

GitHub Pages héberge seulement les fichiers HTML/CSS/JS statiques. PICO CMS nécessite Bun, une base SQLite persistante et une authentification serveur. Pour conserver **un site et un panneau Admin fonctionnels**, la version interactive reste déployée sur Railway.

### Exécuter le serveur Bun

Nécessite Bun, un répertoire persistant `/data` et les variables d'environnement `PORT`, `ADMIN_PASSWORD`, `SESSION_SECRET`. Le serveur stocke les produits, articles, médias, pages et statistiques dans SQLite. Sur Railway, le volume `/data` est déjà configuré.

```bash
bun run server/index.tsx
```

**Sécurité :** ne jamais publier de mots de passe, de secrets de session ou de bases SQLite dans le dépôt. La connexion Admin utilise les variables Railway, qui **ne sont pas copiées ici**.

**Amazon :** les liens présents sont ordinaires tant que le compte Partenaires n'est pas configuré. Les photos produits restent soumises aux droits des marques concernées. Les paiements en ligne ne sont pas encore activés.

## Source et déploiement

Le code dans `server/index.tsx` est une **copie du code déployé** au 22 novembre 2026. Il ne met pas automatiquement Railway à jour lorsqu'un commit est effectué : pour actualiser l'application, il faut republier la version dans Railway et vérifier le volume, les variables d'environnement et la base de données.
