export interface Platform {
    platform: {
        id: number;
        name: string;
        slug: string;
    };
}

export interface Genre {
    id: number;
    name: string;
    slug: string;
}

export interface Tag {
    id: number;
    name: string;
    slug: string;
    language: string;
}

export interface Game {
    id: number;
    slug: string;
    name: string;
    released: string;
    background_image: string;
    rating: number;
    description_raw: string;
    website: string;
    platforms: Platform[];
    genres: Genre[];
    tags: Tag[];
}
