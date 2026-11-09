import bcrypt from 'bcryptjs'

/**
 * Catalog seed data. Images are local copies of openly licensed photography
 * (Unsplash) stored in /public/images so the storefront renders without
 * depending on third-party image hosts.
 */

const IMG = {
  lap1: '/images/laptop-01.jpg',
  lap2: '/images/laptop-02.jpg',
  lap3: '/images/laptop-03.jpg',
  lap4: '/images/laptop-04.jpg',
  lap5: '/images/laptop-05.jpg',
  lap6: '/images/laptop-06.jpg',
  lap7: '/images/laptop-07.jpg',
  lap8: '/images/laptop-08.jpg',
  lap9: '/images/laptop-09.jpg',
  lap10: '/images/laptop-10.jpg',
  lap11: '/images/laptop-11.jpg',
  lap12: '/images/laptop-12.jpg',
  lap13: '/images/laptop-13.jpg',
  lap14: '/images/laptop-14.jpg',
  desk1: '/images/desktop-01.jpg',
  desk2: '/images/desktop-02.jpg',
  desk3: '/images/desktop-03.jpg',
  mon1: '/images/monitor-01.jpg',
  game1: '/images/gaming-01.jpg',
  game2: '/images/gaming-02.jpg',
  game3: '/images/gaming-03.jpg',
  game4: '/images/gaming-04.jpg',
  mouse1: '/images/acc-mouse-01.jpg',
  mouse2: '/images/acc-mouse-02.jpg',
  mouse3: '/images/acc-mouse-03.jpg',
  key1: '/images/acc-keyboard-01.jpg',
  key2: '/images/acc-keyboard-02.jpg',
  key3: '/images/acc-keyboard-03.jpg',
  key4: '/images/acc-keyboard-04.jpg',
  hp1: '/images/acc-headphones-01.jpg',
  hp2: '/images/acc-headphones-02.jpg',
  bag: '/images/acc-bag-01.jpg',
  hub: '/images/acc-hub-01.jpg',
  setup: '/images/setup-01.jpg',
  macro: '/images/macro-keyboard.jpg',
}

export const categories = [
  { name: 'Ultrabooks', slug: 'ultrabooks', subtitle: 'Thin, light, all-day battery', image: IMG.lap2, grp: 'laptops', sort: 1 },
  { name: 'Gaming Laptops', slug: 'gaming-laptops', subtitle: 'High refresh, RTX graphics', image: IMG.game1, grp: 'laptops', sort: 2 },
  { name: 'Business Laptops', slug: 'business-laptops', subtitle: 'Secure, durable, managed', image: IMG.lap5, grp: 'laptops', sort: 3 },
  { name: '2-in-1 Laptops', slug: '2-in-1-laptops', subtitle: 'Convertible touch displays', image: IMG.lap8, grp: 'laptops', sort: 4 },
  { name: 'Student Laptops', slug: 'student-laptops', subtitle: 'Campus-ready value', image: IMG.lap9, grp: 'laptops', sort: 5 },
  { name: 'Workstations', slug: 'workstations', subtitle: 'Creative & pro performance', image: IMG.lap10, grp: 'laptops', sort: 6 },
  { name: 'Desktop Computers', slug: 'desktop-computers', subtitle: 'Towers built to scale', image: IMG.desk3, grp: 'desktops', sort: 7 },
  { name: 'All-in-One PCs', slug: 'all-in-one-pcs', subtitle: 'One screen, zero clutter', image: IMG.desk2, grp: 'desktops', sort: 8 },
  { name: 'Monitors', slug: 'monitors', subtitle: '4K, ultrawide, high refresh', image: IMG.mon1, grp: 'monitors', sort: 9 },
  { name: 'Keyboards & Mice', slug: 'keyboards-mice', subtitle: 'Tactile control', image: IMG.key3, grp: 'accessories', sort: 10 },
  { name: 'Laptop Accessories', slug: 'laptop-accessories', subtitle: 'Bags, hubs, storage', image: IMG.bag, grp: 'accessories', sort: 11 },
  { name: 'Gaming Accessories', slug: 'gaming-accessories', subtitle: 'Gear for every session', image: IMG.game4, grp: 'accessories', sort: 12 },
]

export const brands = [
  'Apple', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'MSI', 'Razer', 'Logitech', 'Samsung', 'Sony', 'Anker', 'Keychron', 'Nexora',
]

const specs = (cpu, ram, storage, gpu, display, resolution, refresh, battery, weight, os) => ({
  cpu, ram, storage, gpu, display, resolution, refresh, battery, weight, os, warranty: '1 Year Official Warranty',
})

const P = (p) => p

export const products = [
  P({ slug: 'apple-macbook-air-m3', name: 'Apple MacBook Air 13" M3', brand: 'Apple', category: 'ultrabooks', price: 1099, original: 1299, rating: 4.9, reviews: 328, badge: 'Best Seller', featured: 1, best: 1, images: [IMG.lap2, IMG.lap8, IMG.lap6], colors: ['Midnight', 'Starlight', 'Space Grey'], stock: 34, specs: specs('Apple M3 (8-core)', '16GB Unified', '512GB SSD', 'Apple 10-core GPU', '13.6" Liquid Retina', '2560 x 1664', '60Hz', 'Up to 18h', '1.24 kg', 'macOS Sonoma'), description: 'The MacBook Air M3 packs pro-level speed into the thinnest, lightest design we have ever shipped. A fanless architecture keeps it silent through long work sessions, while the 13.6-inch Liquid Retina display delivers 500 nits of brightness and full P3 colour.' }),
  P({ slug: 'dell-xps-13-9340', name: 'Dell XPS 13 (9340)', brand: 'Dell', category: 'ultrabooks', price: 1249, original: 1449, rating: 4.7, reviews: 214, badge: 'New Arrival', featured: 1, images: [IMG.lap5, IMG.lap11, IMG.lap4], colors: ['Platinum', 'Graphite'], stock: 21, specs: specs('Intel Core Ultra 7 155H', '16GB LPDDR5x', '512GB NVMe SSD', 'Intel Arc Graphics', '13.4" OLED Touch', '2880 x 1800', '120Hz', 'Up to 12h', '1.19 kg', 'Windows 11 Home'), description: 'A 13-inch machine with a 3K OLED panel, an edge-to-edge keyboard and Intel Core Ultra efficiency. Machined from a single block of aluminium, the XPS 13 is the most portable full-performance laptop Dell makes.' }),
  P({ slug: 'hp-spectre-x360-14', name: 'HP Spectre x360 14', brand: 'HP', category: '2-in-1-laptops', price: 1399, original: 1599, rating: 4.8, reviews: 176, featured: 1, images: [IMG.lap8, IMG.lap12, IMG.lap10], colors: ['Nightfall Black', 'Slate Blue'], stock: 18, specs: specs('Intel Core Ultra 7 155H', '16GB LPDDR5', '1TB NVMe SSD', 'Intel Arc Graphics', '14" 2.8K OLED Touch', '2880 x 1800', '120Hz', 'Up to 13h', '1.44 kg', 'Windows 11 Home'), description: 'A convertible built for creators: 2.8K OLED, a bundled precision pen and a 360-degree hinge that turns the Spectre into a tablet for sketching on the go.' }),
  P({ slug: 'lenovo-thinkpad-x1-carbon-gen-12', name: 'Lenovo ThinkPad X1 Carbon Gen 12', brand: 'Lenovo', category: 'business-laptops', price: 1649, original: 1899, rating: 4.8, reviews: 142, featured: 1, images: [IMG.lap4, IMG.lap9, IMG.lap14], colors: ['Black'], stock: 15, specs: specs('Intel Core Ultra 7 165U', '32GB LPDDR5x', '1TB NVMe SSD', 'Intel Graphics', '14" IPS Anti-glare', '1920 x 1200', '60Hz', 'Up to 15h', '1.09 kg', 'Windows 11 Pro'), description: 'The reference business ultrabook. MIL-STD durability, a best-in-class keyboard, discrete TPM and optional vPro manageability — all under 1.1kg.' }),
  P({ slug: 'asus-rog-zephyrus-g14', name: 'ASUS ROG Zephyrus G14', brand: 'ASUS', category: 'gaming-laptops', price: 1599, original: 1799, rating: 4.9, reviews: 268, badge: 'Best Seller', featured: 1, best: 1, images: [IMG.game1, IMG.lap1, IMG.game2], colors: ['Eclipse Grey', 'Platinum White'], stock: 12, specs: specs('AMD Ryzen 9 8945HS', '16GB LPDDR5x', '1TB NVMe SSD', 'NVIDIA RTX 4060 8GB', '14" OLED', '2880 x 1800', '120Hz', 'Up to 10h', '1.50 kg', 'Windows 11 Home'), description: 'A 14-inch gaming laptop that fits in a backpack: RTX 4060 graphics, a 120Hz OLED panel and a CNC aluminium chassis that stays cool under load.' }),
  P({ slug: 'acer-nitro-16', name: 'Acer Nitro 16', brand: 'Acer', category: 'gaming-laptops', price: 899, original: 1099, rating: 4.5, reviews: 431, featured: 1, images: [IMG.lap1, IMG.game3, IMG.lap3], colors: ['Obsidian Black'], stock: 27, specs: specs('AMD Ryzen 7 7735HS', '16GB DDR5', '512GB NVMe SSD', 'NVIDIA RTX 4050 6GB', '16" IPS', '1920 x 1200', '165Hz', 'Up to 8h', '2.70 kg', 'Windows 11 Home'), description: 'Serious frame rates at an entry price. A 165Hz panel, dual-fan cooling and an upgrade-friendly chassis make the Nitro 16 an easy recommendation.' }),
  P({ slug: 'msi-katana-15', name: 'MSI Katana 15', brand: 'MSI', category: 'gaming-laptops', price: 949, original: 1149, rating: 4.4, reviews: 205, images: [IMG.lap3, IMG.game4, IMG.lap12], colors: ['Black'], stock: 23, specs: specs('Intel Core i7-13620H', '16GB DDR5', '1TB NVMe SSD', 'NVIDIA RTX 4060 8GB', '15.6" IPS', '1920 x 1080', '144Hz', 'Up to 7h', '2.25 kg', 'Windows 11 Home'), description: 'RTX 4060 performance with a 144Hz display and Cooler Boost 5 thermals. A dependable desktop replacement for competitive play.' }),
  P({ slug: 'hp-pavilion-15', name: 'HP Pavilion 15', brand: 'HP', category: 'student-laptops', price: 599, original: 749, rating: 4.3, reviews: 512, featured: 1, images: [IMG.lap7, IMG.lap6, IMG.lap13], colors: ['Natural Silver', 'Warm Gold'], stock: 41, specs: specs('Intel Core i5-1335U', '16GB DDR4', '512GB NVMe SSD', 'Intel Iris Xe', '15.6" FHD IPS', '1920 x 1080', '60Hz', 'Up to 9h', '1.75 kg', 'Windows 11 Home'), description: 'The everyday laptop done properly: a bright FHD screen, a comfortable keyboard and enough battery to get through a full day of classes.' }),
  P({ slug: 'apple-macbook-pro-14-m3-pro', name: 'Apple MacBook Pro 14" M3 Pro', brand: 'Apple', category: 'workstations', price: 1999, original: 2199, rating: 4.9, reviews: 189, badge: 'Pro Pick', featured: 1, images: [IMG.lap2, IMG.lap11, IMG.lap8], colors: ['Space Black', 'Silver'], stock: 9, specs: specs('Apple M3 Pro (11-core)', '18GB Unified', '512GB SSD', 'Apple 14-core GPU', '14.2" Liquid Retina XDR', '3024 x 1964', '120Hz', 'Up to 18h', '1.61 kg', 'macOS Sonoma'), description: 'XDR brightness, studio-grade microphones and M3 Pro throughput for colour work, code and audio. The 14-inch Pro is the sweet spot of the line-up.' }),
  P({ slug: 'dell-inspiron-15-3520', name: 'Dell Inspiron 15 3520', brand: 'Dell', category: 'student-laptops', price: 449, original: 599, rating: 4.2, reviews: 620, best: 1, images: [IMG.lap6, IMG.lap4, IMG.lap7], colors: ['Carbon Black'], stock: 55, specs: specs('Intel Core i5-1235U', '8GB DDR4', '256GB NVMe SSD', 'Intel Iris Xe', '15.6" FHD', '1920 x 1080', '120Hz', 'Up to 7h', '1.65 kg', 'Windows 11 Home'), description: 'A no-nonsense 15-inch laptop for coursework, streaming and light multitasking at a genuinely accessible price.' }),
  P({ slug: 'lenovo-ideapad-slim-5', name: 'Lenovo IdeaPad Slim 5', brand: 'Lenovo', category: 'student-laptops', price: 649, original: 799, rating: 4.4, reviews: 288, images: [IMG.lap9, IMG.lap14, IMG.lap13], colors: ['Cloud Grey', 'Abyss Blue'], stock: 37, specs: specs('AMD Ryzen 5 7530U', '16GB DDR4', '512GB NVMe SSD', 'AMD Radeon Graphics', '14" WUXGA IPS', '1920 x 1200', '60Hz', 'Up to 11h', '1.46 kg', 'Windows 11 Home'), description: 'Rated for 11 hours of mixed use with a 16:10 panel that makes documents and timelines far more comfortable to read.' }),
  P({ slug: 'asus-zenbook-14-oled', name: 'ASUS Zenbook 14 OLED', brand: 'ASUS', category: 'ultrabooks', price: 999, original: 1199, rating: 4.7, reviews: 164, images: [IMG.lap12, IMG.lap10, IMG.lap5], colors: ['Jade Black', 'Ponder Blue'], stock: 26, specs: specs('Intel Core Ultra 7 155H', '16GB LPDDR5x', '1TB NVMe SSD', 'Intel Arc Graphics', '14" 3K OLED', '2880 x 1800', '120Hz', 'Up to 13h', '1.22 kg', 'Windows 11 Home'), description: 'A 3K OLED ultrabook with military-grade durability and a footprint barely wider than an A4 sheet.' }),
  P({ slug: 'razer-blade-16', name: 'Razer Blade 16', brand: 'Razer', category: 'gaming-laptops', price: 2799, original: 2999, rating: 4.8, reviews: 96, badge: 'Limited', images: [IMG.game2, IMG.lap1, IMG.game3], colors: ['Black'], stock: 7, specs: specs('Intel Core i9-14900HX', '32GB DDR5', '1TB NVMe SSD', 'NVIDIA RTX 4070 8GB', '16" QHD+ Mini-LED', '2560 x 1600', '240Hz', 'Up to 6h', '2.45 kg', 'Windows 11 Home'), description: 'A 240Hz Mini-LED display, per-key Chroma lighting and vapour-chamber cooling in a unibody aluminium chassis.' }),
  P({ slug: 'hp-probook-450-g10', name: 'HP ProBook 450 G10', brand: 'HP', category: 'business-laptops', price: 879, original: 1029, rating: 4.5, reviews: 133, images: [IMG.lap5, IMG.lap9, IMG.lap4], colors: ['Pike Silver'], stock: 31, specs: specs('Intel Core i5-1335U', '16GB DDR4', '512GB NVMe SSD', 'Intel Iris Xe', '15.6" FHD IPS', '1920 x 1080', '60Hz', 'Up to 10h', '1.72 kg', 'Windows 11 Pro'), description: 'Business essentials without the premium: TPM 2.0, a spill-resistant keyboard and full-size ports for the office dock.' }),
  P({ slug: 'dell-latitude-7440', name: 'Dell Latitude 7440', brand: 'Dell', category: 'business-laptops', price: 1299, original: 1499, rating: 4.6, reviews: 88, images: [IMG.lap11, IMG.lap8, IMG.lap14], colors: ['Titan Grey'], stock: 19, specs: specs('Intel Core i7-1365U vPro', '16GB LPDDR5', '512GB NVMe SSD', 'Intel Iris Xe', '14" FHD+ Anti-glare', '1920 x 1200', '60Hz', 'Up to 14h', '1.32 kg', 'Windows 11 Pro'), description: 'vPro manageability, an aluminium lid and a 14-inch 16:10 panel — built for fleet deployment and daily travel.' }),
  P({ slug: 'lenovo-yoga-7i-14', name: 'Lenovo Yoga 7i 14', brand: 'Lenovo', category: '2-in-1-laptops', price: 849, original: 999, rating: 4.5, reviews: 214, images: [IMG.lap8, IMG.lap12, IMG.lap7], colors: ['Storm Grey', 'Arctic Grey'], stock: 28, specs: specs('Intel Core i5-1335U', '16GB LPDDR5', '512GB NVMe SSD', 'Intel Iris Xe', '14" WUXGA Touch', '1920 x 1200', '60Hz', 'Up to 12h', '1.49 kg', 'Windows 11 Home'), description: 'A convertible with a 360-degree hinge, pen support and a display that folds flat for sketching and presenting.' }),
  P({ slug: 'hp-envy-x360-15', name: 'HP Envy x360 15', brand: 'HP', category: '2-in-1-laptops', price: 949, original: 1099, rating: 4.4, reviews: 176, images: [IMG.lap12, IMG.lap8, IMG.lap6], colors: ['Nightfall Black'], stock: 22, specs: specs('AMD Ryzen 7 7730U', '16GB DDR4', '512GB NVMe SSD', 'AMD Radeon Graphics', '15.6" FHD Touch', '1920 x 1080', '60Hz', 'Up to 11h', '1.79 kg', 'Windows 11 Home'), description: 'A large-format convertible for creative work: Ryzen 7 performance, touch input and a comfortable backlit keyboard.' }),
  P({ slug: 'acer-swift-go-14', name: 'Acer Swift Go 14', brand: 'Acer', category: 'ultrabooks', price: 749, original: 899, rating: 4.4, reviews: 152, images: [IMG.lap14, IMG.lap10, IMG.lap2], colors: ['Steel Grey'], stock: 33, specs: specs('Intel Core i5-13500H', '16GB LPDDR5', '512GB NVMe SSD', 'Intel Iris Xe', '14" 2.8K OLED', '2880 x 1800', '90Hz', 'Up to 9h', '1.32 kg', 'Windows 11 Home'), description: 'OLED at a mainstream price. A bright 2.8K panel and 13th-gen H-series silicon make the Swift Go unusually quick for its class.' }),
  P({ slug: 'asus-proart-studiobook-16', name: 'ASUS ProArt Studiobook 16', brand: 'ASUS', category: 'workstations', price: 2199, original: 2499, rating: 4.7, reviews: 64, images: [IMG.lap10, IMG.lap1, IMG.game3], colors: ['Mineral Black'], stock: 8, specs: specs('AMD Ryzen 9 7940HS', '32GB DDR5', '1TB NVMe SSD', 'NVIDIA RTX 4070 8GB', '16" 3.2K OLED', '3200 x 2000', '120Hz', 'Up to 9h', '2.40 kg', 'Windows 11 Pro'), description: 'Colour-calibrated 3.2K OLED, a physical ASUS Dial and ISV certification for CAD and video pipelines.' }),
  P({ slug: 'msi-modern-15', name: 'MSI Modern 15', brand: 'MSI', category: 'business-laptops', price: 699, original: 849, rating: 4.2, reviews: 118, images: [IMG.lap4, IMG.lap7, IMG.lap5], colors: ['Classic Black'], stock: 29, specs: specs('Intel Core i5-13420H', '16GB DDR4', '512GB NVMe SSD', 'Intel UHD Graphics', '15.6" FHD IPS', '1920 x 1080', '60Hz', 'Up to 8h', '1.70 kg', 'Windows 11 Home'), description: 'A slim 15-inch workhorse with a full numpad, HDMI and USB-A — practical for spreadsheets and office docks.' }),
  P({ slug: 'apple-imac-24-m3', name: 'Apple iMac 24" M3', brand: 'Apple', category: 'all-in-one-pcs', price: 1299, original: 1499, rating: 4.8, reviews: 142, featured: 1, images: [IMG.desk2, IMG.desk1, IMG.setup], colors: ['Blue', 'Silver', 'Green'], stock: 14, specs: specs('Apple M3 (8-core)', '16GB Unified', '512GB SSD', 'Apple 10-core GPU', '24" 4.5K Retina', '4480 x 2520', '60Hz', '—', '4.48 kg', 'macOS Sonoma'), description: 'An entire desktop inside an 11.5mm display. 4.5K Retina, a 1080p webcam and studio-quality mics, with a colour-matched keyboard and mouse.' }),
  P({ slug: 'dell-optiplex-7010', name: 'Dell OptiPlex 7010 Desktop', brand: 'Dell', category: 'desktop-computers', price: 799, original: 949, rating: 4.5, reviews: 96, images: [IMG.desk3, IMG.setup, IMG.desk1], colors: ['Black'], stock: 24, specs: specs('Intel Core i5-13500', '16GB DDR4', '512GB NVMe SSD', 'Intel UHD 770', 'No display included', 'Up to 4K', '—', '—', '5.90 kg', 'Windows 11 Pro'), description: 'A compact business tower with tool-less access, vPro options and enough headroom for a discrete GPU upgrade.' }),
  P({ slug: 'hp-omen-45l-gaming-desktop', name: 'HP OMEN 45L Gaming Desktop', brand: 'HP', category: 'desktop-computers', price: 1899, original: 2199, rating: 4.7, reviews: 78, images: [IMG.game3, IMG.desk3, IMG.game1], colors: ['Black'], stock: 11, specs: specs('Intel Core i7-14700K', '32GB DDR5', '1TB NVMe SSD', 'NVIDIA RTX 4070 Ti 12GB', 'No display included', 'Up to 8K', '—', '—', '18.20 kg', 'Windows 11 Home'), description: 'A liquid-cooled tower with a 360mm radiator, tempered glass and a chassis designed around airflow rather than looks alone.' }),
  P({ slug: 'samsung-odyssey-g7-27', name: 'Samsung Odyssey G7 27"', brand: 'Samsung', category: 'monitors', price: 699, original: 849, rating: 4.7, reviews: 231, images: [IMG.mon1, IMG.game4, IMG.setup], colors: ['Black'], stock: 26, specs: specs('—', '—', '—', '—', '27" QHD 1000R Curved', '2560 x 1440', '240Hz', '—', '8.20 kg', '—'), description: 'A 240Hz curved QHD panel with 1ms response and HDR600 — competitive gaming without the refresh-rate compromise.' }),
  P({ slug: 'dell-ultrasharp-27-4k', name: 'Dell UltraSharp 27" 4K', brand: 'Dell', category: 'monitors', price: 549, original: 699, rating: 4.8, reviews: 187, images: [IMG.setup, IMG.mon1, IMG.desk2], colors: ['Platinum Silver'], stock: 30, specs: specs('—', '—', '—', '—', '27" IPS Black 4K', '3840 x 2160', '60Hz', '—', '6.40 kg', '—'), description: 'Factory-calibrated 4K with 98% DCI-P3, USB-C 90W power delivery and a fully adjustable stand for colour-critical work.' }),
  P({ slug: 'logitech-mx-master-3s', name: 'Logitech MX Master 3S', brand: 'Logitech', category: 'keyboards-mice', price: 99, original: 119, rating: 4.9, reviews: 892, best: 1, images: [IMG.mouse2, IMG.mouse1, IMG.mouse3], colors: ['Graphite', 'Pale Grey'], stock: 64, specs: specs('—', '—', '—', '—', '—', '8000 DPI', '—', '70 days', '141 g', '—'), description: 'The benchmark productivity mouse: 8K DPI tracking, quiet clicks and MagSpeed scrolling that flies through long documents.' }),
  P({ slug: 'keychron-q1-pro', name: 'Keychron Q1 Pro Keyboard', brand: 'Keychron', category: 'keyboards-mice', price: 179, original: 209, rating: 4.8, reviews: 143, images: [IMG.key2, IMG.key1, IMG.macro], colors: ['Carbon Black', 'Shell White'], stock: 22, specs: specs('—', '—', '—', '—', '75% Layout', 'QMK / VIA', '1000Hz', '90h', '1.60 kg', '—'), description: 'A CNC aluminium gasket-mounted keyboard that is fully programmable through QMK, with hot-swap sockets and Bluetooth.' }),
  P({ slug: 'sony-wh-1000xm5', name: 'Sony WH-1000XM5', brand: 'Sony', category: 'laptop-accessories', price: 349, original: 399, rating: 4.8, reviews: 512, images: [IMG.hp2, IMG.hp1, IMG.setup], colors: ['Black', 'Silver'], stock: 28, specs: specs('—', '—', '—', '—', '—', '—', '—', '30h', '250 g', '—'), description: 'Industry-leading noise cancelling with eight microphones, 30-hour battery and crystal-clear calls for the open-plan office.' }),
  P({ slug: 'nexora-tech-backpack-16', name: 'Nexora Tech Backpack 16"', brand: 'Nexora', category: 'laptop-accessories', price: 89, original: 119, rating: 4.6, reviews: 97, images: [IMG.bag, IMG.hub, IMG.macro], colors: ['Black', 'Charcoal'], stock: 48, specs: specs('—', '—', '—', '—', 'Fits up to 16"', '—', '—', '—', '0.95 kg', '—'), description: 'Water-resistant 22L commuter pack with a suspended 16-inch laptop sleeve, luggage pass-through and a quick-access tech organiser.' }),
  P({ slug: 'anker-usb-c-hub-8in1', name: 'Anker 8-in-1 USB-C Hub', brand: 'Anker', category: 'laptop-accessories', price: 69, original: 89, rating: 4.5, reviews: 264, images: [IMG.hub, IMG.macro, IMG.setup], colors: ['Black'], stock: 58, specs: specs('—', '—', '—', '—', '—', '4K 60Hz', '—', '—', '120 g', '—'), description: 'HDMI 4K60, two USB-A, USB-C data, SD and microSD plus 100W passthrough charging in a pocketable aluminium body.' }),
  P({ slug: 'samsung-t7-1tb-ssd', name: 'Samsung T7 1TB Portable SSD', brand: 'Samsung', category: 'laptop-accessories', price: 109, original: 139, rating: 4.7, reviews: 341, images: [IMG.macro, IMG.hub, IMG.key4], colors: ['Titan Grey'], stock: 44, specs: specs('—', '—', '1TB', '—', '—', '1050 MB/s', '—', '—', '98 g', '—'), description: 'Sequential reads up to 1,050 MB/s with AES 256-bit hardware encryption and a shock-resistant metal shell.' }),
  P({ slug: 'razer-blackwidow-v4', name: 'Razer BlackWidow V4', brand: 'Razer', category: 'gaming-accessories', price: 169, original: 199, rating: 4.6, reviews: 218, images: [IMG.key4, IMG.key1, IMG.game4], colors: ['Black'], stock: 25, specs: specs('—', '—', '—', '—', 'Full-size', '—', '8000Hz', '—', '1.20 kg', '—'), description: 'Green mechanical switches, a magnetic plush wrist rest and per-key Chroma RGB with dedicated macro and media controls.' }),
  P({ slug: 'razer-deathadder-v3', name: 'Razer DeathAdder V3', brand: 'Razer', category: 'gaming-accessories', price: 89, original: 109, rating: 4.7, reviews: 306, images: [IMG.mouse3, IMG.mouse1, IMG.game4], colors: ['Black', 'White'], stock: 39, specs: specs('—', '—', '—', '—', '—', '30000 DPI', '—', '90h', '59 g', '—'), description: 'A 59g ergonomic esports mouse with a 30K optical sensor and optical switches rated to 90 million clicks.' }),
  P({ slug: 'logitech-c920-hd-webcam', name: 'Logitech C920 HD Webcam', brand: 'Logitech', category: 'laptop-accessories', price: 79, original: 99, rating: 4.4, reviews: 428, images: [IMG.setup, IMG.hub, IMG.hp1], colors: ['Black'], stock: 52, specs: specs('—', '—', '—', '—', '—', '1080p 30fps', '—', '—', '162 g', '—'), description: 'Full HD 1080p calling with dual mics, automatic light correction and a universal clip for monitors and laptops.' }),
]

export const reviewPool = [
  { name: 'Ayesha Khan', rating: 5, title: 'Exactly as described', body: 'Arrived two days early and the build quality is superb. The screen is genuinely bright enough to use outdoors.' },
  { name: 'Daniel Mercer', rating: 4, title: 'Great value', body: 'Performance is excellent for the price. Fans get audible under sustained load, but nothing unusual for this class.' },
  { name: 'Sofia Alvarez', rating: 5, title: 'My second purchase here', body: 'Ordered with a hub and a sleeve — packaging was immaculate and the warranty card was included.' },
  { name: 'Imran Sheikh', rating: 4, title: 'Solid daily driver', body: 'Battery comfortably lasts a working day of documents and calls. Keyboard is the highlight for me.' },
  { name: 'Hannah Fischer', rating: 5, title: 'Premium feel', body: 'Feels far more expensive than it costs. Setup took minutes and everything worked out of the box.' },
]

export function seed(db) {
  const count = db.prepare('SELECT COUNT(*) AS n FROM products').get().n
  if (count > 0) return

  const catId = {}
  const insCat = db.prepare('INSERT INTO categories (name, slug, subtitle, image, grp, sort_order) VALUES (?, ?, ?, ?, ?, ?)')
  for (const c of categories) {
    const r = insCat.run(c.name, c.slug, c.subtitle, c.image, c.grp, c.sort)
    catId[c.slug] = Number(r.lastInsertRowid)
  }

  const brandId = {}
  const insBrand = db.prepare('INSERT INTO brands (name, slug) VALUES (?, ?)')
  for (const b of brands) {
    const r = insBrand.run(b, b.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
    brandId[b] = Number(r.lastInsertRowid)
  }

  const insProduct = db.prepare(`INSERT INTO products
    (slug, name, brand_id, category_id, price, original_price, rating, review_count, specs, images, colors, description, stock, badge, featured, best_seller, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)

  const insReview = db.prepare('INSERT INTO reviews (product_id, name, rating, title, body, verified, created_at) VALUES (?, ?, ?, ?, ?, 1, ?)')

  let i = 0
  for (const p of products) {
    i += 1
    const created = new Date(Date.now() - i * 36 * 3600 * 1000).toISOString()
    const r = insProduct.run(
      p.slug, p.name, brandId[p.brand], catId[p.category], p.price, p.original,
      p.rating, p.reviews, JSON.stringify(p.specs), JSON.stringify(p.images),
      JSON.stringify(p.colors), p.description, p.stock ?? 20, p.badge || null,
      p.featured ? 1 : 0, p.best ? 1 : 0, created,
    )
    const pid = Number(r.lastInsertRowid)
    const take = (i % 3) + 1
    for (let k = 0; k < take; k += 1) {
      const rv = reviewPool[(i + k) % reviewPool.length]
      insReview.run(pid, rv.name, rv.rating, rv.title, rv.body, new Date(Date.now() - (k + 1) * 5 * 86400 * 1000).toISOString())
    }
  }

  const insUser = db.prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)')
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@nexora.pk'
  const adminPass = process.env.ADMIN_PASSWORD || 'Admin@1234'
  insUser.run('Nexora Admin', adminEmail, bcrypt.hashSync(adminPass, 10), 'admin')
  insUser.run('Demo Customer', 'demo@nexora.pk', bcrypt.hashSync('Demo@1234', 10), 'customer')

  db.prepare('INSERT INTO coupons (code, percent) VALUES (?, ?)').run('SAVE10', 10)
  db.prepare('INSERT INTO coupons (code, percent) VALUES (?, ?)').run('NEXORA15', 15)

  const orderNumber = 'NX-' + String(Date.now()).slice(-8)
  const cust = db.prepare('SELECT id FROM users WHERE email = ?').get('demo@nexora.pk')
  const first = db.prepare('SELECT id, name, price, images FROM products WHERE slug = ?').get('apple-macbook-air-m3')
  const firstImg = JSON.parse(first.images)[0]
  const subtotal = first.price
  const o = db.prepare(`INSERT INTO orders (order_number, user_id, email, customer_name, phone, address, city, postal_code, country, subtotal, shipping, discount, total, status, payment_method, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?, 'Delivered', 'Card (demo)', ?)`)
    .run(orderNumber, cust.id, 'demo@nexora.pk', 'Demo Customer', '+92 300 1234567', '12 Jinnah Avenue', 'Karachi', '75500', 'Pakistan', subtotal, subtotal, new Date(Date.now() - 6 * 86400 * 1000).toISOString())
  db.prepare('INSERT INTO order_items (order_id, product_id, name, price, qty, image) VALUES (?, ?, ?, ?, ?, ?)')
    .run(Number(o.lastInsertRowid), first.id, first.name, first.price, 1, firstImg)
}
