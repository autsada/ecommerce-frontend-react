import { Product } from '../types'

export const products: Pick<
  Product,
  | 'id'
  | 'title'
  | 'description'
  | 'price'
  | 'image_url'
  | 'category'
  | 'inventory'
>[] = [
  {
    id: '1',
    title: 'The Wool Shirt',
    description:
      'The wool shirt made with a tailored fit. The true original, optimized for rugged outdoor adventures.',
    price: 40,
    image_url:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSGJKYof4yQS64n2fQrrbdYXqYMUuC-RuLRQA&usqp=CAU',
    category: 'Clothing',
    inventory: 5,
  },
  {
    id: '2',
    title: 'Adult Nike T-Shirt',
    description: 'The Nike T-Shirt for adult, red color.',
    price: 19,
    image_url:
      'https://messisport-e281.kxcdn.com/25511-large_default/n4149-nike-f-c-t-shirt-noble-red.jpg',
    category: 'Clothing',
    inventory: 20,
  },
  {
    id: '3',
    title: 'Red Wing Leather Belt',
    description: "Men's Belt in Amber Pioneer Leather.",
    price: 39,
    image_url:
      'https://embed.widencdn.net/img/redwing/uvauwazczu/600x600px/RH96502C_WEB_NA_1016?position=S&crop=no&color=EDE8DD',
    category: 'Accessories',
    inventory: 4,
  },
  {
    id: '4',
    title: "Men's Golf Belt",
    description: 'Find the Nike Flat Edge Acu-Fit at Nike.com.',
    price: 33,
    image_url:
      'https://static.nike.com/a/images/t_default/eyf6gmvl3pfredroxcy1/stretch-woven-mens-golf-belt-w9wjMN.jpg',
    category: 'Accessories',
    inventory: 12,
  },
  {
    id: '5',
    title: 'Beta Belt',
    description: 'Beta Belt - Black Diamond Gear.',
    price: 24,
    image_url:
      'https://www.bfgcdn.com/600_600_90/203-1173-0311/black-diamond-beta-belt-belt.jpg',
    category: 'Accessories',
    inventory: 0,
  },
]
