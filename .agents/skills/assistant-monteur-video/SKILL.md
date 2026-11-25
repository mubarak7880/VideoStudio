---
name: assistant-monteur-video
description: >-
  Protocole complet et règles de workflow pour l'assistant monteur vidéo et
  réalisateur technique sur Windows (PowerShell / agy). Utiliser cette skill
  systématiquement pour toute demande de préparation, nettoyage, transcription,
  téléchargement de B-rolls, détourage de personnages, animation de personnages
  SVG articulés, assemblage, sous-titres ou rendu vidéo (FFmpeg, auto-editor,
  faster-whisper, edge-tts, rembg, yt-dlp, Remotion).
---

# Assistant Monteur Vidéo & Réalisateur Technique — Règles de Workflow

Ce document définit le protocole obligatoire à appliquer rigoureusement à chaque tâche de montage ou de production vidéo dans l'espace de travail `D:\2026\VideoStudio`.

---

## 1. Architecture des Dossiers de Référence

- `rushs_bruts/` : Dépôt des vidéos sources non montées (**lecture seule**).
- `Bibliotheque_ref/` : Ressources locales de référence (**lecture seule**, sauf ajout de nouveaux B-rolls/assets validés) :
  - `Bibliotheque_ref/styles/` : Exemples de styles visuels, templates Remotion, références d'animations.
  - `Bibliotheque_ref/images/` : Logos, photos, visuels fixes, images sources de personnages à détourer.
  - `Bibliotheque_ref/b-rolls/` : Courtes vidéos d'illustration téléchargées ou importées.
  - `Bibliotheque_ref/bruitages/` : Effets sonores (SFX), transitions audio, musiques de fond.
  - `Bibliotheque_ref/palette_couleur/` : Fichiers JSON/CSS ou références de chartes graphiques.
  - `Bibliotheque_ref/polices/` : Fichiers `.ttf`, `.otf`, `.woff2` pour les sous-titres et titres.
- `rendu/` : Dossier exclusif pour l'exportation des vidéos finales montées en `.mp4`.
- `studio-remotion/` : Projet Remotion local pour le montage programmatique et le rendu React/TypeScript (`@remotion/captions`, `@remotion/media-utils`, `@remotion/transitions`).
- `.venv/` : Environnement virtuel Python local (`faster-whisper`, `auto-editor`, `edge-tts`, `rembg`, `onnxruntime`).

---

## 2. Règles d'Or du Workflow Vidéo

### A. Protection Absolue des Sources
- **Ne modifie et n'écrase JAMAIS** les fichiers présents dans `rushs_bruts/` ou `Bibliotheque_ref/`.
- Travaille toujours sur des **copies temporaires** (par exemple dans un dossier temporaire ou `studio-remotion/public/`).
- Exporte le résultat final **uniquement dans `rendu/`** avec un nom explicite, versionné et/ou daté (ex. `rendu/projet_final_2026-11-24_v1.mp4`).

### B. Utilisation Systématique des Ressources Locales
- **Avant de générer ou télécharger quoi que ce soit**, inspecte systématiquement le contenu de `Bibliotheque_ref/` (`styles`, `palette_couleur`, `polices`, `bruitages`, `b-rolls`, `images`).
- Applique en priorité la charte graphique, les polices, les palettes de couleurs et les bruitages existants dans `Bibliotheque_ref/`.

### C. Téléchargement d'Illustrations (`yt-dlp`)
- Lorsqu'une vidéo d'illustration (B-roll) externe est demandée :
  - Télécharge **uniquement le segment utile** avec `--download-sections "*DEBUT-FIN"`.
  - Force un format MP4 compatible : `-f "bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]" --merge-output-format mp4`.
  - Range directement le fichier obtenu dans `Bibliotheque_ref/b-rolls/` avec un nom descriptif.
  - Exemple de commande PowerShell :
    ```powershell
    yt-dlp --download-sections "*00:01:15-00:01:30" -f "bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]" --merge-output-format mp4 -o "Bibliotheque_ref/b-rolls/nom_broll.%(ext)s" "<URL>"
    ```

### D. Nettoyage et Découpage des Rushs (`auto-editor`, `faster-whisper`, `ffmpeg`)
- **Suppression des silences** :
  - Utilise `auto-editor` via l'environnement `.venv` (`.\.venv\Scripts\auto-editor.exe`) ou `ffmpeg`.
  - Applique **toujours une marge de sécurité audio de `0.1s` à `0.15s`** (`--margin 0.15sec`) pour ne jamais couper la fin ou l'attaque des mots :
    ```powershell
    .\.venv\Scripts\auto-editor.exe "rushs_bruts/source.mp4" --margin 0.15sec --output "temp_clean.mp4"
    ```
- **Coupe chirurgicale d'une phrase ou d'un segment spécifique** :
  - Génère d'abord la transcription avec timestamps au niveau des mots (`word_timestamps=True`) via `faster-whisper` (`.\.venv\Scripts\python.exe`).
  - Identifie les secondes exactes de début et de fin avant d'effectuer la découpe avec `ffmpeg`.

### E. Montage Programmatique (Remotion)
- **Compétence Remotion** : Applique systématiquement les règles de la skill `remotion-best-practices`.
- **Intégration Vidéo Sans Saccade** : Utilise impérativement `<OffthreadVideo>` (de `remotion`) et **JAMAIS `<Video>`** pour intégrer les rushs principaux et les B-rolls afin de garantir un rendu fluide image par image.
- **Sous-titres Dynamiques Mot à Mot** :
  - Génère un fichier JSON de transcription avec timestamps mot à mot via `faster-whisper`.
  - Synchronise et affiche les sous-titres dynamiques via `@remotion/captions` (ex. `createTikTokStyleCaptions`).
- **Habillage Sonore (SFX)** :
  - Intègre les bruitages depuis `Bibliotheque_ref/bruitages/` (via `<Audio>` de `remotion`) lors des apparitions de titres, zooms ou transitions clés.
- **Création et Animation de Personnages (SVG Articulés & Images Détourées)** :
  - **Personnages Détourés (`rembg`)** :
    - À partir d'images placées dans `Bibliotheque_ref/images/` (sans jamais modifier l'original), effectue un détourage automatique avec `rembg` (`.\.venv\Scripts\python.exe` avec `from rembg import remove` ou `.\.venv\Scripts\rembg.exe i`) et sauvegarde le PNG transparent dans `studio-remotion/public/`.
    - Anime le personnage détouré dans Remotion via `spring()`, `interpolate()` et des transformations CSS/2D (entrée/sortie dynamique, flottement/respiration `Math.sin(frame / ...)`, rebond synchronisé à la voix, inclinaison, zoom).
  - **Personnages SVG Articulés (Rigging 2D React/SVG)** :
    - Crée des composants React `<svg>` modulaires structurés en groupes articulés (`<g>` pour la tête, les yeux/paupières, les sourcils, la bouche, le buste et les bras/mains) avec des points de pivot (`transformOrigin` / `transformBox: 'fill-box'`) bien définis.
    - Anime les articulations (hochements de tête, clignements d'yeux périodiques, gestuelle des bras, respiration) de façon fluide et déterministe avec `useCurrentFrame()`, `spring()` et `interpolate()`.
  - **Synchronisation Labiale (Lip-Sync Audio / Whisper)** :
    - *Approche Amplitude Audio (`@remotion/media-utils`)* : Utilise `useAudioData()` et `visualizeAudio()` pour extraire l'amplitude sonore à la frame courante et piloter dynamiquement l'ouverture de la bouche (hauteur/échelle verticale ou bascule entre visèmes SVG fermés/semi-ouverts/ouverts) ainsi qu'un léger rebond du personnage lorsqu'il parle.
    - *Approche Timestamps (`faster-whisper`)* : Utilise les segments et `word_timestamps` du JSON Whisper pour activer précisément les mouvements de bouche et d'expression uniquement pendant les mots prononcés et revenir à l'état de repos pendant les silences.
- **Rendu Final** :
  - Exporte la composition finale directement vers `../rendu/<nom_explicite_date_v1>.mp4` :
    ```powershell
    cd studio-remotion
    npx remotion render <CompositionId> "../rendu/projet_final_v1.mp4"
    ```
