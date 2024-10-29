import express from "express";
import cors from "cors";
import connection from "./connection";

const {
  getMusics,
  searchMusicByName,
  findMusicById,
  addMusic,
} = require("./musics/functionsMusics");

const {
  getAlbuns,
  searchAlbumsByName,
  getAlbunsMusics,
} = require("./albuns/functionsAlbuns");

const { searchArtistsByName } = require("./artists/functionsArtists");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.delete("/musics/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletMusic = await connection("musics")
      .where({ idmusic: id })
      .delete();
    if (!deletMusic) {
      res.send(`Musica ${id} não encontrada`);
    }
    res.send(`Musica ${id} deletada`);
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar a música" });
  }
});

app.put("/musics/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { namemusic, genremusic, idalbum } = req.body;
    const alterMusic = await connection("musics")
      .update({ namemusic, genremusic, idalbum })
      .where({ idmusic: id });
    if (!alterMusic) {
      res.status(404).json({ message: "Música não encontrada" });
    }
    res.status(200).json({ message: "Música atualizada com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar música", error });
  }
});

app.post("/musics", async (req, res) => {
  const { idmusic, namemusic, genremusic, duration, idalbum } = req.body;
  try {
    await addMusic(idmusic, namemusic, genremusic, duration, idalbum);
    res.send(`Musica ${namemusic} adicionada com sucesso!`);
  } catch (error) {
    res.status(500).json({ message: "Erro ao adicionar música", error });
  }
});

//post para fazer login

app.get("/:id/music", async (req, res) => {
  try {
    const { id } = req.params;
    const AlbunsMusics = await getAlbunsMusics();
    if (!AlbunsMusics) {
      throw new Error("Album não encontrado");
    }
    res.status(200).json(AlbunsMusics);
  } catch (error) {
    res.status(500).json({ message: `Erro ao buscar o album`, error });
  }
});

app.get("/musics/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const findMusicsId = await findMusicById(id);
    if (!findMusicsId) {
      throw new Error(`Música com id ${id} não encontrada`);
    }
    res.status(200).json(findMusicsId);
  } catch (error) {
    res.status(500).json({ message: `Erro ao buscar a musica`, error });
  }
});

app.get("/search", async (req, res) => {
  const name = req.query.name?.toString().toLowerCase();
  try {
    if (!name) {
      throw new Error('O parâmetro de busca "name" é obrigatório.');
    }

    const [musics, albums, artists] = await Promise.all([
      searchMusicByName(name),
      searchAlbumsByName(name),
      searchArtistsByName(name),
    ]);

    if (!musics.length && !albums.length && !artists.length) {
      throw new Error("Nenhuma música, álbum ou artista foi encontrada.");
    }

    res.status(200).json({ musics, albums, artists });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao buscar música, álbum ou artista", error });
  }
});

app.get("/albuns", async (req, res) => {
  const result = await getAlbuns();
  try {
    if (result.length === 0) {
      throw new Error("Não há playlists disponíveis no momento.");
    }
    res.send(result);
  } catch (error) {
    res.status(404).json({ message: "Erro ao buscar playlists.", error });
  }
});

app.get("/musics", async (req, res) => {
  const result = await getMusics();
  try {
    if (result.length === 0) {
      throw new Error("Não há músicas disponíveis no momento.");
    }
    res.send(result);
  } catch (error) {
    res.status(404).json({ message: "Erro ao buscar musicas.", error });
  }
});
