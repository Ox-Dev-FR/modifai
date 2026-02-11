export interface Prompt {
  id: string;
  beforeImage: string;
  afterImage: string;
  prompt: string;
  model: string;
  author: {
    name: string;
    avatar: string;
  };
  likes: number;
}

export const mockPrompts: Prompt[] = [
  {
    id: "1",
    beforeImage: "https://picsum.photos/seed/city-before/800/800",
    afterImage: "https://picsum.photos/seed/city-after/800/800",
    prompt: "A futuristic cyberpunk city with neon lights, rain-slicked streets, and flying cars, cinematic lighting, 8k resolution, photorealistic.",
    model: "Midjourney v6",
    author: {
      name: "Alex Designer",
      avatar: "https://picsum.photos/seed/alex/100/100",
    },
    likes: 124,
  },
  {
    id: "2",
    beforeImage: "https://picsum.photos/seed/portrait-before/800/800",
    afterImage: "https://picsum.photos/seed/portrait-after/800/800",
    prompt: "Professional studio portrait of a young woman, soft lighting, bokeh background, 85mm lens, sharp focus, high detaile skin texture.",
    model: "Stable Diffusion XL",
    author: {
      name: "Sarah Art",
      avatar: "https://picsum.photos/seed/sarah/100/100",
    },
    likes: 89,
  },
  {
    id: "3",
    beforeImage: "https://picsum.photos/seed/landscape-before/800/800",
    afterImage: "https://picsum.photos/seed/landscape-after/800/800",
    prompt: "Fantasy landscape with floating islands, waterfalls, and a dragon flying in the distance, oil painting style, vibrant colors.",
    model: "DALL-E 3",
    author: {
      name: "Mike Creative",
      avatar: "https://picsum.photos/seed/mike/100/100",
    },
    likes: 256,
  },
    {
    id: "4",
    beforeImage: "https://picsum.photos/seed/cat-before/800/800",
    afterImage: "https://picsum.photos/seed/cat-after/800/800",
    prompt: "A cute cat wearing a space suit on Mars, digital art, cartoon style, vibrant orange and blue colors.",
    model: "Midjourney v5",
    author: {
      name: "SpaceCat",
      avatar: "https://picsum.photos/seed/catuser/100/100",
    },
    likes: 412,
  },
  {
    id: "5",
    beforeImage: "https://picsum.photos/seed/car-before/800/800",
    afterImage: "https://picsum.photos/seed/car-after/800/800",
    prompt: "Vintage muscle car restoration, cherry red paint, chrome details, sunset background, realistic 3d render.",
    model: "Stable Diffusion 1.5",
    author: {
      name: "CarLover",
      avatar: "https://picsum.photos/seed/carl/100/100",
    },
    likes: 67,
  },
   {
    id: "6",
    beforeImage: "https://picsum.photos/seed/food-before/800/800",
    afterImage: "https://picsum.photos/seed/food-after/800/800",
    prompt: "Gourmet burger photography, melting cheese, fresh lettuce, steam rising, dark background, professional food styling.",
    model: "Midjourney v6",
    author: {
      name: "ChefAI",
      avatar: "https://picsum.photos/seed/chef/100/100",
    },
    likes: 198,
  },
];
