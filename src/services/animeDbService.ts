import { AppDataSource } from '../config/database';
import { Anime } from '../entities/Anime';
import { AnimeSearchResult } from '../types/anime';
import logger from '../utils/logger';

export function convertAnimeToSearchResult(anime: Anime): AnimeSearchResult {
    return {
        mal_id: anime.id,
        title: anime.title,
        images: {
            jpg: anime.main_picture
        },
        synopsis: anime.synopsis,
        score: anime.mean,
        rank: anime.rank,
        popularity: anime.popularity,
        num_list_users: anime.num_list_users,
        num_scoring_users: anime.num_scoring_users,
        status: anime.status,
        type: anime.media_type
    };
}

export async function findAnimeInDb(query: string): Promise<AnimeSearchResult[]> {
    const animeRepository = AppDataSource.getRepository(Anime);
    try {
        const animes = await animeRepository.createQueryBuilder("anime")
            .where("anime.title LIKE :query", { query: `%${query}%` })
            .getMany();
        return animes.map(convertAnimeToSearchResult);
    } catch (error) {
        logger.error(`Error finding anime in database: ${error}`);
        return [];
    }
}

export async function saveAnimeToDb(animeData: AnimeSearchResult): Promise<void> {
    const animeRepository = AppDataSource.getRepository(Anime);
    try {
        const anime = animeRepository.create({
            id: animeData.mal_id,
            title: animeData.title,
            main_picture: animeData.images.jpg,
            synopsis: animeData.synopsis,
            mean: animeData.score,
            rank: animeData.rank,
            popularity: animeData.popularity,
            num_list_users: animeData.num_list_users,
            num_scoring_users: animeData.num_scoring_users,
            status: animeData.status,
            media_type: animeData.type
        });
        await animeRepository.save(anime);
    } catch (error) {
        logger.error(`Error saving anime to database: ${error}`);
    }
}