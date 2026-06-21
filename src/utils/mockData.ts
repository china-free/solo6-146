import type { Category, MemeWork, MaterialImage, Comment, UserInfo, TextLayer } from '@/types';
import { generateId } from '@/utils/storage';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-funny', name: '搞笑', emoji: '😂', isSystem: true },
  { id: 'cat-reaction', name: '反应', emoji: '😱', isSystem: true },
  { id: 'cat-animal', name: '动物', emoji: '🐱', isSystem: true },
  { id: 'cat-anime', name: '动漫', emoji: '🎌', isSystem: true },
  { id: 'cat-dialog', name: '对话', emoji: '💬', isSystem: true },
];

function makeTemplate(name: string, category: string, seed: number): MaterialImage {
  return {
    id: generateId(),
    url: `https://picsum.photos/seed/meme${seed}/600/600`,
    name,
    category,
    width: 600,
    height: 600,
    createdAt: Date.now() - seed * 86400000,
    isSystem: true,
  };
}

export const DEFAULT_TEMPLATES: MaterialImage[] = [
  makeTemplate('经典困惑脸', 'cat-funny', 1),
  makeTemplate('大笑不止', 'cat-funny', 2),
  makeTemplate('震惊反应', 'cat-reaction', 3),
  makeTemplate('无语凝视', 'cat-reaction', 4),
  makeTemplate('猫咪卖萌', 'cat-animal', 5),
  makeTemplate('狗狗傻笑', 'cat-animal', 6),
  makeTemplate('动漫热血', 'cat-anime', 7),
  makeTemplate('动漫萌系', 'cat-anime', 8),
  makeTemplate('气泡对话', 'cat-dialog', 9),
  makeTemplate('对比反差', 'cat-funny', 10),
];

const nicknames = ['表情包大师', '快乐打工人', '摸鱼达人', '二次元狂热者', '快乐小狗', '奶茶续命'];
const avatarSeeds = ['sunny', 'cloudy', 'rainy', 'starry', 'moon', 'ocean'];

export const mockUsers: UserInfo[] = [
  {
    id: generateId(),
    nickname: nicknames[0],
    avatar: `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${avatarSeeds[0]}`,
  },
  {
    id: generateId(),
    nickname: nicknames[1],
    avatar: `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${avatarSeeds[1]}`,
  },
  {
    id: generateId(),
    nickname: nicknames[2],
    avatar: `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${avatarSeeds[2]}`,
  },
];

const commentTemplates = [
  '哈哈哈哈太有才了！',
  '这个表情包我收了',
  '笑死我了🤣',
  '这也太真实了吧',
  '求原图！！',
  '已经存图用起来了',
  '脑洞太大了哈哈哈',
  '绝绝子！',
  '我直接笑死',
  '这个梗我懂',
];

export function generateComments(count: number): Comment[] {
  const comments: Comment[] = [];
  const usedIndexes = new Set<number>();
  for (let i = 0; i < count; i++) {
    const userIdx = i % mockUsers.length;
    const user = mockUsers[userIdx];
    let contentIdx: number;
    do {
      contentIdx = Math.floor(Math.random() * commentTemplates.length);
    } while (usedIndexes.has(contentIdx) && usedIndexes.size < commentTemplates.length);
    usedIndexes.add(contentIdx);
    comments.push({
      id: generateId(),
      content: commentTemplates[contentIdx],
      authorName: user.nickname,
      authorAvatar: user.avatar,
      createdAt: Date.now() - Math.floor(Math.random() * 86400000 * 7),
      likes: Math.floor(Math.random() * 50),
    });
  }
  return comments;
}

const workTitles = [
  '周一打工状态',
  '当领导突然出现',
  '我和我的冤种朋友',
  '当代大学生日常',
  '被生活毒打后',
  '减肥又失败了',
  '恋爱脑觉醒',
  '代码写不出来',
  '放假前最后一小时',
  '奶茶续命成功',
  '躺平的快乐',
  '社交恐惧症发作',
];

const layerContents = [
  '我太难了',
  '啊？？？',
  '笑死',
  '离谱',
  '就这？',
  '我不理解',
  '绝绝子',
  '打工人',
  '摆烂了',
  '不想上班',
  '哈哈哈哈',
  '救命',
  'yyds',
  '无语',
  '真的会谢',
];

function makeLayer(content: string, x: number, y: number, z: number, color?: string, strokeColor?: string): TextLayer {
  return {
    id: generateId(),
    content,
    x,
    y,
    fontSize: 36 + Math.floor(Math.random() * 12),
    fontFamily: 'ZCOOL KuaiLe, sans-serif',
    color: color || '#FFFFFF',
    strokeColor: strokeColor || '#000000',
    strokeWidth: 3,
    bold: true,
    italic: false,
    align: 'center',
    rotation: Math.floor(Math.random() * 10) - 5,
    opacity: 1,
    zIndex: z,
  };
}

function makeLayers(count: number): TextLayer[] {
  const layers: TextLayer[] = [];
  const positions = [
    { x: 300, y: 80 },
    { x: 300, y: 520 },
    { x: 150, y: 300 },
    { x: 450, y: 300 },
    { x: 300, y: 300 },
  ];
  const colors = [
    ['#FF2E9E', '#FFFFFF'],
    ['#FFEB3B', '#000000'],
    ['#00F0FF', '#0D0B1F'],
    ['#FFFFFF', '#000000'],
    ['#FF6B6B', '#FFFFFF'],
  ];
  for (let i = 0; i < count; i++) {
    const contentIdx = Math.floor(Math.random() * layerContents.length);
    const pos = positions[i % positions.length];
    const col = colors[i % colors.length];
    layers.push(makeLayer(layerContents[contentIdx], pos.x, pos.y, i, col[0], col[1]));
  }
  return layers;
}

export const COMMUNITY_WORKS: MemeWork[] = Array.from({ length: 12 }, (_, i) => {
  const author = mockUsers[i % mockUsers.length];
  const layerCount = 2 + Math.floor(Math.random() * 3);
  const commentCount = 2 + Math.floor(Math.random() * 4);
  const baseUrl = `https://picsum.photos/seed/work${i + 100}/600/600`;
  return {
    id: generateId(),
    title: workTitles[i % workTitles.length] + (i >= workTitles.length ? ` ${Math.floor(i / workTitles.length) + 1}` : ''),
    baseImage: baseUrl,
    baseImageWidth: 600,
    baseImageHeight: 600,
    layers: makeLayers(layerCount),
    thumbnail: baseUrl,
    createdAt: Date.now() - (i + 1) * 3600000 * Math.floor(Math.random() * 24 + 1),
    updatedAt: Date.now() - i * 1800000,
    isPublic: true,
    likes: Math.floor(Math.random() * 500) + 10,
    comments: generateComments(commentCount),
    author,
  };
});
