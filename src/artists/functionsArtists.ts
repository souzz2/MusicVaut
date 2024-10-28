import connection from "../connections";
import { Artist } from "./typeArtist";

const searchArtistsByName = async (name: string): Promise<Artist[]> => {
  return await connection("artists").where("nameartist", "like", `%${name}%`);
};

module.exports = {
  searchArtistsByName,
};
