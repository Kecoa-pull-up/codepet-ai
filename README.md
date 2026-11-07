# CodePet AI 🐾

**Your Virtual Coding Companion in Visual Studio Code**

CodePet AI adalah ekstensi Visual Studio Code yang menghadirkan virtual pet interaktif sebagai pendamping aktivitas pemrograman. Pet memiliki statistik, sistem level, perilaku dinamis, dan kemampuan mendeteksi aktivitas coding pengguna.

## 1. Project Overview

CodePet AI dikembangkan menggunakan TypeScript dan VS Code Extension API. Antarmuka virtual pet dibangun menggunakan Webview dengan HTML, CSS, dan JavaScript.

Tujuan proyek:
- Mengembangkan virtual pet yang interaktif.
- Mengintegrasikan sistem perilaku dan statistik pet.
- Mendeteksi aktivitas pemrograman melalui VS Code API.
- Mengembangkan sistem reward berdasarkan aktivitas coding.
- Menyiapkan fondasi integrasi AI coding assistant pada tahap berikutnya.

## 2. Technology Stack

| Teknologi | Fungsi |
|---|---|
| TypeScript | Extension logic |
| Visual Studio Code API | Integrasi dengan VS Code |
| HTML | Struktur Webview |
| CSS | Tampilan dan animasi pet |
| JavaScript | Interaksi Webview |
| Node.js & npm | Development environment |
| VS Code GlobalState | Penyimpanan status pet |
| Git & GitHub | Version control |

## 3. Current Features

### Virtual Pet System
- Karakter virtual pet berbasis CSS.
- Animasi idle, bounce, dan sleeping.
- Perubahan tampilan berdasarkan mood.
- Interaksi melalui klik karakter.

### Pet Statistics
- Energy: tingkat energi pet.
- Happiness: tingkat kebahagiaan pet.
- Mood: kondisi emosional pet.
- Level: perkembangan pet.
- EXP: pengalaman pet.

### Pet Actions
- Feed: meningkatkan Energy dan Happiness.
- Sleep: memulihkan Energy dan Happiness.
- Play: meningkatkan Happiness dan EXP.
- Interact: memberikan respons dan EXP.

### Pet Behavior
- Respons pesan yang bervariasi.
- Perubahan mood berdasarkan statistik.
- Passive behavior.
- Sistem pengalaman dan level-up.

### Persistence System
Status pet disimpan menggunakan VS Code `context.globalState`, sehingga data tetap tersedia setelah ekstensi dimulai ulang.

### Offline Simulation
Energy dan Happiness dapat mengalami penurunan berdasarkan waktu yang berlalu ketika VS Code tidak aktif. Simulasi dibatasi maksimal 24 jam.

### Coding Activity Detection
CodePet dapat mendeteksi:
- File yang dibuka.
- Perubahan kode.
- File yang disimpan.
- File yang ditutup.
- Bahasa pemrograman melalui VS Code document language ID.

Aktivitas ditampilkan melalui Output Channel bernama `CodePet Coding Activity`.

**Catatan:** Coding Activity Detection saat ini masih berupa pencatatan aktivitas. Reward EXP otomatis belum diintegrasikan.

## 4. Project Structure

```text
codepet-ai/
├── src/
│   ├── extension.ts
│   │
│   ├── pet/
│   │   ├── petState.ts
│   │   ├── petBehavior.ts
│   │   ├── petMessageHandler.ts
│   │   └── codingActivity.ts
│   │
│   └── webview/
│       ├── petViewProvider.ts
│       └── ui/
│           ├── pet.html
│           ├── style.css
│           └── pet.js
│
├── media/
│   └── icons/
│       └── pet.svg
│
├── package.json
├── tsconfig.json
├── esbuild.config.mjs
├── eslint.config.mjs
└── README.md
```

## 5. Installation

### Requirements
- Visual Studio Code.
- Node.js.
- npm.
- Git.

### Clone Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd codepet-ai
```

### Install Dependencies

```bash
npm install
```

### Compile Project

```bash
npm run compile
```

### Run Extension

1. Buka proyek menggunakan VS Code.
2. Tekan `F5`.
3. Tunggu Extension Development Host terbuka.
4. Buka sidebar CodePet.
5. Mulai berinteraksi dengan pet.

## 6. Development and Testing

Untuk memeriksa hasil kompilasi:

```bash
npm run compile
```

Untuk melihat aktivitas coding:

1. Buka menu `View`.
2. Pilih `Output`.
3. Pilih channel `CodePet Coding Activity`.

## 7. Development Progress

| Phase | Development | Status |
|---|---|---|
| 1 | Extension & Webview Setup | Completed |
| 2 | Pet Character & Animation | Completed |
| 3 | Pet Interaction System | Completed |
| 4 | Happiness & Passive Behavior | Completed |
| 5 | Pet State Persistence | Completed |
| 6 | Offline Time Simulation | Completed |
| 7 | Pet Personality & Advanced Behavior | Completed |
| 8.1 | Coding Activity Detection | Completed |
| 8.2 | Coding Activity Reward System | Planned |

## 8. Roadmap

Rencana pengembangan selanjutnya:

- [ ] Coding activity EXP reward.
- [ ] Anti-farming reward mechanism.
- [ ] Coding session tracking.
- [ ] Achievement system.
- [ ] Pet customization.
- [ ] Additional pet animations.
- [ ] AI-powered coding interaction.
- [ ] Multi-provider AI integration.
- [ ] Database integration.
- [ ] Extension packaging and distribution.

## 9. Architecture Overview

```text
VS Code Extension Host
        |
        ├── PetStateManager
        |       |
        |       ├── PetBehavior
        |       └── GlobalState Persistence
        |
        ├── CodingActivityTracker
        |
        └── PetViewProvider
                |
                └── Webview
                      |
                      ├── pet.html
                      ├── style.css
                      └── pet.js
```

## 10. Project Status

CodePet AI is currently in active development.

The core virtual pet system, persistence mechanism, offline simulation, and coding activity detection have been implemented and tested in the VS Code Extension Development Host.

AI integration and coding activity reward mechanisms remain under development.

---

**CodePet AI — Your Coding Companion.**