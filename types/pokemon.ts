export const MAXPOKEMONID = 1025;
export const typeColorMap = new Map<string, string>([
    ['fire', 'bg-red-500'],
    ['water', 'bg-blue-500'],
    ['grass', 'bg-green-500'],
    ['electric', 'bg-yellow-500'],
    ['poison', 'bg-purple-500'],
    ['normal', 'bg-gray-500'],
    ['fighting', 'bg-orange-500'],
    ['flying', 'bg-teal-500'],
    ['fairy', 'bg-pink-400'],
    ['ground', 'bg-amber-800'],
    ['psychic', 'bg-fuchsia-600'],
    ['ice', 'bg-cyan-300'],
    ['bug', 'bg-lime-500'],
    ['rock', 'bg-stone-400'],
    ['dragon', 'bg-blue-700'],
    ['dark', 'bg-amber-950'],
    ['ghost', 'bg-purple-950'],
    ['steel', 'bg-cyan-700']
]);
export interface Pokemon {
    id: number;
    name: string;
    sprites: {
        front_default: string;
        other: {
            'official-artwork': {
                front_default: string;
            };
        };
    };
    types: Array<{
        type: {
            name: string;
        };
    }>;
    height: number;
    weight: number;
    stats: Array<{
        base_stat: number;
        stat: {
            name: string;
        };
    }>;
    abilities: Array<{
        ability: {
            name: string;
            url: string;
        };
        is_hidden: boolean;
    }>;
    moves: Array<{
        move: {
            name: string;
            url: string;
        };
    }>;
}
