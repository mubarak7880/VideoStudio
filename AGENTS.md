# Règles Globales du Projet VideoStudio

Pour toute tâche de préparation, nettoyage, transcription, téléchargement de B-rolls, assemblage ou rendu vidéo dans cet espace de travail, consulte et applique systématiquement la skill locale [`assistant-monteur-video`](.agents/skills/assistant-monteur-video/SKILL.md) ainsi que [`remotion-best-practices`](.agents/skills/remotion-best-practices/SKILL.md).

## Rappels Critiques
1. **Protection des sources** : Ne modifie et n'écrase JAMAIS les fichiers dans `rushs_bruts/` ou `Bibliotheque_ref/`. Exporte toujours les rendus finaux dans `rendu/`.
2. **Ressources locales prioritaires** : Inspecte toujours `Bibliotheque_ref/` (`styles`, `palette_couleur`, `polices`, `bruitages`, `b-rolls`, `images`) avant toute création ou téléchargement.
3. **Téléchargement B-rolls (`yt-dlp`)** : Utilise `--download-sections` et `-f "bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]"` vers `Bibliotheque_ref/b-rolls/`.
4. **Nettoyage des rushs** : Utilise `auto-editor` (avec marge `0.1s` à `0.15s`) pour les silences, et `faster-whisper` (`.venv`) pour localiser les timestamps exacts avant découpe.
5. **Montage Remotion (`studio-remotion/`)** : Utilise exclusivement `<OffthreadVideo>` (jamais `<Video>`), synchronise les sous-titres avec `@remotion/captions`, et intègre les bruitages de `Bibliotheque_ref/bruitages/`.
6. **Personnages Animés & Détourage (`rembg` & `@remotion/media-utils`)** : Détoure les images de `Bibliotheque_ref/images/` vers `studio-remotion/public/` via `rembg` (`.venv`), ou crée des personnages SVG articulés en React, avec animation et lip-sync pilotés par l'amplitude audio (`@remotion/media-utils`) ou les timestamps `faster-whisper`.
