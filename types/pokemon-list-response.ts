export interface PokemonListResponse {
    count: number;
    results: Array<{
        name: string;
        url: string;
    }>;
}
