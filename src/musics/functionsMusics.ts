import { Knex } from "knex";
import connection from "../connections";
import { Music } from "./typeMusics";

/*
const deleteMusicById = async (id) => {
    return await connection("musics").where({ idmusic: id }).delete();
  };
 
  const updateMusicById = async (id, namemusic, genremusic, idalbum) => {
    return await connection("musics")
      .update({ namemusic, genremusic, idalbum })
      .where({ idmusic: id });
  };
  
*/ 
  const addMusic = async (idmusic: string, namemusic: string, genremusic: string,duration:string, idalbum: string): Promise<Music[]> => {
    return await connection("musics").insert({
      idmusic,
      namemusic,
      genremusic,
      duration,
      idalbum,
    });
  };
  

const findMusicById = async (id: string): Promise<Music[]> => {
  return await connection("musics").select("namemusic").where("idmusic", id);
};

const searchMusicByName = async (name: string): Promise<Music[]> => {
  return await connection("musics").where("namemusic", "like", `%${name}%`);
};

const getMusics = async () => {
  return await connection("musics");
};

module.exports = {
  getMusics,
  searchMusicByName,
  findMusicById,
  addMusic,
};
