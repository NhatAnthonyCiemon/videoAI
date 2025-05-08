type ContentItem = {
    text: string;
    imagePrompt: string;
};

type ContentGenerate = {
    fullContent: string;
    keyword: string;
    arrayContent: ContentItem[] | null;
};

export type { ContentItem, ContentGenerate };
