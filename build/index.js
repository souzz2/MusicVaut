"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const connections_1 = __importDefault(require("./connections"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
app.delete("/musics/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletMusic = yield (0, connections_1.default)("music")
            .where({ idmusic: id })
            .delete();
        if (!deletMusic) {
            res.send(`Musica ${id} não encontrada`);
        }
        res.send(`Musica ${id} deletada`);
    }
    catch (error) {
        res.status(500).json({ message: "Erro ao deletar a música" });
    }
}));
app.put("/musics/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { namemusic, genremusic, idalbum } = req.body;
        const alterMusic = yield (0, connections_1.default)("music")
            .update({ namemusic, genremusic, idalbum })
            .where({ idmusic: id });
        if (!alterMusic) {
            res.status(404).json({ message: "Música não encontrada" });
        }
        res.status(200).json({ message: "Música atualizada com sucesso" });
    }
    catch (error) {
        res.status(500).json({ message: "Erro ao atualizar música", error });
    }
}));
app.post("/musics", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idmusic, namemusic, genremusic, idalbum } = req.body;
    try {
        const adicionarMusica = yield (0, connections_1.default)("music").insert({
            idmusic: idmusic,
            namemusic: namemusic,
            genremusic: genremusic,
            idalbum: idalbum,
        });
        res.send(`Musica ${namemusic} adicionada com sucesso!`);
    }
    catch (error) {
        res.status(500).json({ message: "Erro ao adicionar música", error });
    }
}));
app.get("/musics/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const findMusicsId = yield (0, connections_1.default)("music")
            .select("namemusic")
            .where("idmusic", "=", `${id}`);
        if (!findMusicsId) {
            return res
                .status(404)
                .json({ message: `Música com id ${id} não encontrada` });
        }
        res.status(200).json(findMusicsId);
    }
    catch (error) {
        res.status(500).json({ message: `Erro ao buscar a musica`, error });
    }
}));
const buscarMusicaPorID = (userID) => {
    return;
};
app.get("/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const name = (_a = req.query.name) === null || _a === void 0 ? void 0 : _a.toString().toLowerCase();
        if (!name) {
            return res
                .status(400)
                .json({ message: 'O parâmetro de busca "name" é obrigatório.' });
        }
        const findMusics = yield (0, connections_1.default)("music").where("namemusic", "like", `%${name}%`);
        const findArtists = yield (0, connections_1.default)("artist").where("nameartist", "like", `%${name}%`);
        const findAlbuns = yield (0, connections_1.default)("album").where("namealbum", "like", `%${name}%`);
        if (findMusics.length === 0 &&
            findAlbuns.length === 0 &&
            findArtists.length === 0) {
            return res
                .status(404)
                .json({ message: "Nenhuma música ou playlist foi encontrada." });
        }
        res.send({
            music: findMusics,
            album: findAlbuns,
            artist: findArtists,
        });
    }
    catch (error) {
        res.status(404).json({
            message: "Nenhuma musica, playlist ou album foi encontrada.",
            error,
        });
    }
}));
app.get("/albuns", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, connections_1.default)("ALBUM");
    try {
        if (result.length === 0) {
            return res
                .status(404)
                .json({ message: "Não há playlists disponíveis no momento." });
        }
        res.send(result);
    }
    catch (error) {
        res.status(404).json({ message: "Erro ao buscar playlists.", error });
    }
}));
app.get("/musics", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, connections_1.default)("MUSIC");
    try {
        if (result.length === 0) {
            return res
                .status(404)
                .json({ message: "Não há músicas disponíveis no momento." });
        }
        res.send(result);
    }
    catch (error) {
        res.status(404).json({ message: "Erro ao buscar musicas.", error });
    }
}));
