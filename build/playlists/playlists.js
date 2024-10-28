"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playlists = void 0;
const musicas_1 = require("../musicas/musicas");
exports.playlists = [
    {
        id: 1,
        nome: "Playlist de Rock",
        descricao: "Uma coleção das melhores músicas de Rock.",
        musicas: [musicas_1.musicas[0]],
    },
    {
        id: 2,
        nome: "Pop Hits",
        descricao: "As melhores do Pop.",
        musicas: [musicas_1.musicas[1], musicas_1.musicas[3]],
    },
];
