const WISHES_DATA = [
    {
        "type": "audio",
        "name": "你美麗的姐Emily❤️",
        "cover": "https://drive.google.com/thumbnail?id=1jUQR6EPCnibgBHiH8d6isDWX70cx-w9t&sz=w800",
        "src": "https://drive.google.com/uc?export=download&id=1OuBf9lr0HlfDyQFGF0E5Z0UroYTpLDUo",
        "message": ""
    },
    {
        "type": "audio",
        "name": "Virginia Kwong",
        "cover": "https://drive.google.com/thumbnail?id=18z5sr4J-a2_rtL7refdn-GSpaFnlqcBf&sz=w800",
        "src": "https://drive.google.com/uc?export=download&id=1TQeYE22sHLDu2SyW1J5y4z-5NHxusa1Z",
        "message": "Congratulations on your special day, Lilian and Lonely. I wish you an endless supply of love, happiness, and laughter. May your lives be filled with beautiful moments. xoxo."
    },
    {
        "type": "audio",
        "name": "Tung Tung & Thomas",
        "cover": "https://drive.google.com/thumbnail?id=1NMgXctS1m5EZ9k7UM49TpBJxWm68Y527&sz=w800",
        "src": "https://drive.google.com/uc?export=download&id=15g0E6-stwMhqvIiWKGEOfxiKkRUpz2ci",
        "message": "卓琳 & Lonely 祝你們新婚快樂！願主的恩典充滿你們的婚姻，心心相印，攜手共度美好人生，幸福美滿、和諧共融。願愛與信仰在你們的生活中常伴隨，永遠相愛，共享主的祝福！"
    },
    {
        "type": "audio",
        "name": "Sin ling",
        "cover": "https://drive.google.com/thumbnail?id=1w3R-DNkBaHt1Olz1LsOORhds_MAP7lV2&sz=w800",
        "src": "https://drive.google.com/uc?export=download&id=1O_HeV_iSlscUuvmkg69pas1Pn_n43AM4",
        "message": "Congratulations！希望你婚後人生更精彩😆😆"
    },
    {
        "type": "audio",
        "name": "Miss Wing",
        "cover": "https://drive.google.com/thumbnail?id=1VaTr3QHqJ0R9XGi5CukO9ke-jKAe09wM&sz=w800",
        "src": "https://drive.google.com/uc?export=download&id=13pwIo39IFhMfR2cJtnTBNqsYH0wU55KI",
        "message": ""
    },
    {
        "type": "audio",
        "name": "善悠 善潼",
        "cover": "https://drive.google.com/thumbnail?id=165bT6XxQwDBr_4QWsUZ8biDwXz2z7tEM&sz=w800",
        "src": "https://drive.google.com/uc?export=download&id=1zLFZ6fBOv_EOGI8E_vpEkfnIVLpM6bVt",
        "message": "Congratulations "
    },
    {
        "type": "audio",
        "name": "心善",
        "cover": "https://drive.google.com/thumbnail?id=1QJCSKQcTfLu68CP9h6_Zim7P4pcUUdRB&sz=w800",
        "src": "https://drive.google.com/uc?export=download&id=16-9MPiXM2eAtbooU2R6gXeqzCTvuIQjU",
        "message": ""
    },
    {
        "type": "video",
        "name": "謝牧師",
        "cover": "",
        "src": "https://drive.google.com/uc?export=download&id=15d2s_kBUZ29K6xGfgQPg-fThCoB8eTL6",
        "message": ""
    },
    {
        "type": "video",
        "name": "Suison ",
        "cover": "",
        "src": "https://drive.google.com/uc?export=download&id=1ZGh7p3wIPIieXQtm1FqUt0XlWxK3qqnU",
        "message": "Happy Wife Happy Life^^"
    },
    {
        "type": "video",
        "name": "Ken Lam",
        "cover": "",
        "src": "https://drive.google.com/uc?export=download&id=1OKDWBf65wMJP9dJB7ZrVrC9PcKot19bk",
        "message": ""
    },
    {
        "type": "video",
        "name": "Katy & sa ",
        "cover": "",
        "src": "https://drive.google.com/uc?export=download&id=1zSnzE2BPWTnRGBxZLS8L26elaTMnDdH3",
        "message": ""
    },
    {
        "type": "video",
        "name": "蚊蚊",
        "cover": "",
        "src": "https://drive.google.com/uc?export=download&id=1LfHNyvY_NSnIvt6QVWYSutRNsWQbKRNy",
        "message": ""
    },
    {
        "type": "video",
        "name": "Hillarie and Dickson",
        "cover": "",
        "src": "https://drive.google.com/uc?export=download&id=19a2SkkZhf0jeHGaGfvnpI0lfTaAdhYYo",
        "message": ""
    },
    {
        "type": "video",
        "name": "Jeremy Lee",
        "cover": "",
        "src": "https://drive.google.com/uc?export=download&id=1VealicIre2NqmwwzpCixx6VFJbaTTA55",
        "message": "祝福你哋喺婚姻嘅關係入面更發現到上帝嗰份無條件嘅愛🥰"
    },
    {
        "type": "video",
        "name": "Manling&Chris",
        "cover": "",
        "src": "https://drive.google.com/uc?export=download&id=1Q6MPc1pnGTb2ha8hytS7wqInuawFwwd3",
        "message": "願你在專屬的花園穿著公主裙，與Lonely拖著手自由奔跑"
    },
    {
        "type": "video",
        "name": "鄭奕陶 （天恩幼兒學校） & 鄭禮謙 （哥哥）",
        "cover": "",
        "src": "https://drive.google.com/uc?export=download&id=1l0DKGkPJbJXRg5UzgeosWV0_lmAgBadz",
        "message": ""
    },
    {
        "type": "video",
        "name": "李澔洋 & 李亦純",
        "cover": "",
        "src": "https://drive.google.com/uc?export=download&id=1d76pUWF9LVHH_GtCl0DIvRrNP8N4AhaC",
        "message": "卓琳老師🥳新婚超級快樂 幸幸福福 三年抱兩👶🏻👶🏻"
    },
    {
        "type": "video",
        "name": "善悠",
        "cover": "",
        "src": "https://drive.google.com/uc?export=download&id=1dA-3gOJ46RFoeyJEmom4kSzk5afk0pTp",
        "message": ""
    },
    {
        "type": "video",
        "name": "善潼",
        "cover": "",
        "src": "https://drive.google.com/uc?export=download&id=18mWPUphIsy1cgC22gJuBF0JanIZ4yWU_",
        "message": ""
    },
    {
        "type": "video",
        "name": "岑耀罡",
        "cover": "",
        "src": "https://drive.google.com/uc?export=download&id=1fSc3-WOQwBJLRW-8Jp2AU18h1Hn7QmNZ",
        "message": "你哋要新婚快樂，日日開心"
    },
    {
        "type": "video",
        "name": "Angela Albee Michelle ",
        "cover": "",
        "src": "https://drive.google.com/uc?export=download&id=1AsvRVDBzvEx8Wr-LnOikTtizww00Lqj-",
        "message": ""
    },
    {
        "type": "video",
        "name": "Lum",
        "cover": "",
        "src": "https://drive.google.com/uc?export=download&id=1MVSRbCayjQW2gEZCTSzgTYFF7XM751ph",
        "message": ""
    },
    {
        "type": "video",
        "name": "大叔舆黃帝仔",
        "cover": "",
        "src": "https://drive.google.com/uc?export=download&id=1e_hdf9S3PJXYK2SPkbXrEfa7AbA635_A",
        "message": ""
    },
    {
        "type": "video",
        "name": "穎塱",
        "cover": "https://drive.google.com/thumbnail?id=1BN1NMm4Af90VMQAQAhFvEZFnPD5-xN92&sz=w800",
        "src": "https://drive.google.com/uc?export=download&id=1wJT58htaMtgvBfR4w3bXA7yEqZbsjouK",
        "message": ""
    },
    {
        "type": "video",
        "name": "澤雄",
        "cover": "",
        "src": "https://drive.google.com/uc?export=download&id=11fQdtrGo7Ojqp0KL7iQwKxY4EzdpD1Dy",
        "message": ""
    },
    {
        "type": "video",
        "name": "戩灝",
        "cover": "https://drive.google.com/thumbnail?id=11yUacSsfAFll3WBBY32sApzuvlZmxah3&sz=w800",
        "src": "https://drive.google.com/uc?export=download&id=1EKGSs_JCSTr59RN2lZGC99j-S0gyCygn",
        "message": ""
    },
    {
        "type": "video",
        "name": "梁証博",
        "cover": "https://drive.google.com/thumbnail?id=1TpQWuNLM8SIo9Lcv5drRmiKSAtVGUDTz&sz=w800",
        "src": "https://drive.google.com/uc?export=download&id=1kfJcjBlu1Y8OndLMzYSti7S3aUYorntm",
        "message": ""
    }
];
