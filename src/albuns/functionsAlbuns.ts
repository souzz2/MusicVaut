import connection from "../connection";
import { Album } from "./typeAlbuns";

const getAlbunsMusics = async (id: string): Promise<Album[]> => {
    return await connection("albuns")
      .select("namemusic")
      .join("musics", "musics.idmusic", "=", "albuns.idmusic")
      .where("idalbum", "=", "${idalbum}$")
      .orderBy("idmusic", "asc");
}

const searchAlbumsByName = async (name: string): Promise<Album[]> => {
  return await connection("albuns").select("namealbum").where("namealbum", "like", `%${name}%`).orderBy("namealbum", "asc").limit(5);
};

const getAlbums = async () => {
  return await connection("albuns").orderBy("idalbum", "asc").limit(10);
};

module.exports = {
  getAlbums,
  searchAlbumsByName,
  getAlbunsMusics,
};