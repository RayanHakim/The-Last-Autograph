
# THE LAST AUTOGRAPH

*A psychological horror anomaly-detection game.*

You are an artist attending an autograph event. Fans arrive one by one, each carrying a piece of paper and asking for your signature.

Most visitors seem normal. Some, however, are not what they appear to be.

Your job is to observe every visitor, inspect their papers, identify unusual details, and decide whether to sign or reject them. A single mistake can cost you a life.

Not every anomaly is obvious. Some hide in a visitor's behavior, while others appear only on the paper they bring.

**Look carefully. Trust your observations. Choose wisely.**

---

## About the Game

**THE LAST AUTOGRAPH** is a browser-based anomaly inspection game built around observation, decision-making, and psychological horror.

Instead of fighting enemies or solving traditional puzzles, players must distinguish normal visitors from anomalies by examining visual clues, dialogue, and suspicious documents.

The game focuses on the tension of making decisions with limited information. Players must decide whether a visitor deserves an autograph or should be rejected.

---

## Gameplay

Each round presents a visitor requesting an autograph.

1. **Observe the Visitor**  
   Examine the character's appearance and read their dialogue carefully.

2. **Inspect the Paper**  
   Look for suspicious details, unusual text, inconsistent information, or other irregularities.

3. **Make a Decision**  
   Choose whether to sign the paper or reject the visitor.

4. **Review the Result**  
   Receive feedback about your decision and continue to the next visitor.

5. **Survive the Event**  
   Avoid mistakes, manage your remaining lives, and aim for a higher score.

---

## Features

- **Visitor Inspection** — Observe characters and examine their dialogue for suspicious behavior.
- **Paper Inspection** — Inspect documents for unusual details and hidden clues.
- **Sign or Reject System** — Make decisions based on the evidence you discover.
- **Visitor Anomalies** — Encounter visitors whose behavior or identity may not be normal.
- **Paper Anomalies** — Discover suspicious documents containing unusual details.
- **Anomaly Index** — Review documented visitor and paper anomalies.
- **Paper Zoom Controls** — Zoom in, zoom out, and reset the paper's display size.
- **Score System** — Track your performance throughout the game.
- **Lives System** — Mistakes can reduce your remaining lives.
- **Game Over and Restart** — Start another run after the game ends.
- **Canvas-Based Graphics** — Render characters and papers through dedicated JavaScript modules.
- **Browser-Based Gameplay** — Play locally without installing a separate game engine.

---

## Anomaly Index

The Anomaly Index provides a reference list of suspicious visitors and documents.

### Visitor Anomalies

Visitors may display unusual behavior, inconsistent statements, or details that suggest something is wrong.

Examples include:

- The Smiling Stranger
- The Silent Guest
- The Familiar Face
- The Last Visitor
- The Second Smile
- The Hollow Witness
- The Split Witness
- The Mouth That Waits

### Paper Anomalies

Documents may contain suspicious dates, altered names, unusual signatures, or unexpected messages.

Examples include:

- Paper Anomaly 01 — The Future Date
- Paper Anomaly 02 — The Existing Signature
- Paper Anomaly 03 — The Hidden Writing
- Paper Anomaly 04 — The Changing Name
- Paper Anomaly 05 — The Inconsistent Date
- Paper Anomaly 06 — The Reversed Signature
- Paper Anomaly 07 — DO NOT SIGN
- Paper Anomaly 08 — NO ONE

*Note: These are reference entries used by the Anomaly Index fallback data. Actual encounters depend on the game's configured databases and gameplay logic.*

---

## Tech Stack

- **HTML5** — Game structure and interface.
- **CSS3** — Layout, styling, and visual presentation.
- **JavaScript** — Gameplay logic, UI interactions, and anomaly data.
- **HTML Canvas** — Character and paper rendering.
- **Local Browser Storage** — Used if and where supported by the game's storage module.

No external game engine is required.

---

## Project Structure

```text
THE-LAST-AUTOGRAPH/
│
├── index.html
├── README.md
│
├── css/
│   └── style.css
│
└── js/
    ├── main.js
    ├── game.js
    ├── characters.js
    ├── papers.js
    ├── effects.js
    └── storage.js
```

*The structure above is an example based on the game's current modules. Adjust the paths to match the actual repository.*

### JavaScript Modules

| File | Responsibility |
|---|---|
| `main.js` | Connects the HTML interface, buttons, paper zoom, and Anomaly Index. |
| `game.js` | Manages gameplay, visitor progression, decisions, and game state. |
| `characters.js` | Handles character rendering. |
| `papers.js` | Handles paper rendering and related visuals. |
| `effects.js` | Manages visual effects. |
| `storage.js` | Handles supported game data persistence. |

---

## How to Run

### Option 1: Visual Studio Code + Live Server

1. Clone or download this repository.
2. Open the project folder in Visual Studio Code.
3. Install the **Live Server** extension if it is not already installed.
4. Open `index.html`.
5. Right-click the file and select **Open with Live Server**.
6. Play the game in your browser.

### Option 2: GitHub Pages

If the project is configured for GitHub Pages:

1. Open the repository on GitHub.
2. Navigate to **Settings → Pages**.
3. Select the deployment source and branch.
4. Save the configuration.
5. Open the published website URL after deployment completes.

Ensure that script and stylesheet paths are compatible with the repository's deployment location.

---

## Development Notes

The project separates interface management from gameplay logic to make development and debugging easier.

- `main.js` manages UI interactions and does not draw character or paper placeholders over the actual canvas.
- `game.js` should remain the source of truth for the gameplay state.
- The Anomaly Index reads `VISITOR_DATABASE` and `PAPER_DATABASE` when those arrays are available.
- Fallback anomaly entries are displayed when the corresponding database is unavailable.
- The HTML must contain the element IDs expected by `main.js`.
- JavaScript files must be loaded in the correct order so that their dependencies are available.

---

## Future Improvements

Potential improvements for future versions include:

- More unique visitor and paper anomalies.
- Additional visual clues and dialogue variations.
- More detailed inspection interactions.
- Persistent anomaly discoveries across play sessions.
- Improved feedback and decision explanations.
- Additional difficulty levels and increasingly subtle anomalies.
- Responsive layouts for different screen sizes.
- Sound design and atmospheric audio.

---

## Project Status

**In Development**

Gameplay systems, anomaly references, visual presentation, and inspection mechanics may change as development continues.

---

## Credits

Created as an independent browser game project.

All original game logic, writing, and visual assets should be credited to their respective creators.

---

## License

No license has been specified yet.

If you intend to let others use, modify, or distribute this project, consider adding an appropriate open-source license.
```

### Saran sebelum dipublikasikan

- Pastikan nama folder di bagian **Project Structure** sesuai dengan struktur repository kamu.
- Jika game sudah memiliki musik, tambahkan informasi audio dan kredit sumbernya di bagian Credits.
- Jika ingin menggunakan GitHub Pages, pastikan `index.html` berada di lokasi yang benar dan semua path file menggunakan struktur relatif yang sesuai.

README ini sudah menjelaskan konsep utama game tanpa mengklaim fitur yang belum tentu sudah selesai dibuat.
