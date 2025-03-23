export interface AbilityDetail {
    name: string;
    effect_entries: Array<{
        effect: string;
        language: {
            name: string;
        }
    }>;
}
