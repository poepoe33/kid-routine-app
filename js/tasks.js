/* ============================================================
   「一步一步」 Step by Step — 任務種子資料
   15 個預設任務，全部依規格書拆好步驟。
   每步三語：yue（粵語口語）／zh（書面語，普通話朗讀用）／en（English）
   step 格式: [粵語, 書面語, English, emoji]
   ============================================================ */
(function (global) {
  'use strict';

  var CATEGORIES = [
    { id: 'morning', name: { yue: '朝早', zh: '早上', en: 'Morning' }, icon: '🌤️' },
    { id: 'study', name: { yue: '功課學習', zh: '功课学习', en: 'Study' }, icon: '✏️' },
    { id: 'meal', name: { yue: '食飯', zh: '吃饭', en: 'Meals' }, icon: '🍚' },
    { id: 'home', name: { yue: '屋企', zh: '家里', en: 'Home' }, icon: '🏠' },
    { id: 'special', name: { yue: '專屬', zh: '专属', en: 'Special' }, icon: '⭐' }
  ];

  var SLOTS = [
    { id: 'morning', name: { yue: '朝早', zh: '早上', en: 'Morning' }, icon: '🌤️', order: 0 },
    { id: 'afternoon', name: { yue: '下午', zh: '下午', en: 'Afternoon' }, icon: '🌞', order: 1 },
    { id: 'evening', name: { yue: '晚上', zh: '晚上', en: 'Evening' }, icon: '🌆', order: 2 },
    { id: 'bedtime', name: { yue: '睡前', zh: '睡前', en: 'Bedtime' }, icon: '🌙', order: 3 }
  ];

  var WEEKDAYS = [
    { id: 0, short: { yue: '日', zh: '日', en: 'S' }, name: { yue: '星期日', zh: '星期日', en: 'Sunday' } },
    { id: 1, short: { yue: '一', zh: '一', en: 'M' }, name: { yue: '星期一', zh: '星期一', en: 'Monday' } },
    { id: 2, short: { yue: '二', zh: '二', en: 'T' }, name: { yue: '星期二', zh: '星期二', en: 'Tuesday' } },
    { id: 3, short: { yue: '三', zh: '三', en: 'W' }, name: { yue: '星期三', zh: '星期三', en: 'Wednesday' } },
    { id: 4, short: { yue: '四', zh: '四', en: 'T' }, name: { yue: '星期四', zh: '星期四', en: 'Thursday' } },
    { id: 5, short: { yue: '五', zh: '五', en: 'F' }, name: { yue: '星期五', zh: '星期五', en: 'Friday' } },
    { id: 6, short: { yue: '六', zh: '六', en: 'S' }, name: { yue: '星期六', zh: '星期六', en: 'Saturday' } }
  ];

  // days: 0=日 1=一 ... 6=六
  var TASK_SEED = [
    {
      id: 'wake', icon: '🛏️', cat: 'morning', slot: 'morning',
      minutes: 8, stars: 3, days: [1, 2, 3, 4, 5],
      title: { yue: '起床 Routine', zh: '起床流程', en: 'Wake Up Routine' },
      steps: [
        ['鬧鐘響，坐起身伸懶腰', '闹钟响，坐起来伸懒腰', 'When the alarm rings, sit up and stretch', '⏰'],
        ['落床著拖鞋，去廁所', '下床穿拖鞋，去厕所', 'Get out of bed, put on slippers, go to the toilet', '🚽'],
        ['擠牙膏，刷牙兩分鐘', '挤牙膏，刷牙两分钟', 'Squeeze the toothpaste and brush for two minutes', '🪥'],
        ['洗面照鏡，整好頭髮', '洗脸照镜子，整理好头发', 'Wash your face, look in the mirror, tidy your hair', '🪞'],
        ['著校服：衫、褲、襪、鞋', '穿校服：上衣、裤子、袜子、鞋子', 'Put on your uniform: shirt, pants, socks and shoes', '👕'],
        ['飲啖水，企枱邊食早餐', '喝口水，站在桌边吃早餐', 'Drink some water and eat breakfast at the table', '🥛']
      ]
    },
    {
      id: 'check', icon: '🚪', cat: 'morning', slot: 'morning',
      minutes: 3, stars: 2, days: [1, 2, 3, 4, 5],
      title: { yue: '出門前檢查', zh: '出门前检查', en: 'Before You Leave' },
      steps: [
        ['拉開書包拉鏈', '拉开书包拉链', 'Unzip your school bag', '🎒'],
        ['水樽有水，放入側袋', '水壶装好水，放进侧袋', 'Fill your water bottle and put it in the side pocket', '💧'],
        ['功課同手冊放入大格', '功课和手册放进大格', 'Put your homework and handbook in the big pocket', '📕'],
        ['八達通放入衫袋', '八达通放进衣袋', 'Put your Octopus card in your pocket', '💳'],
        ['口罩紙巾放前格', '口罩和纸巾放进前格', 'Put a mask and tissues in the front pocket', '😷'],
        ['著好鞋，講「準備好」', '穿好鞋子，说「准备好了」', 'Put on your shoes and say "Ready!"', '👟']
      ]
    },
    {
      id: 'packbag', icon: '🎒', cat: 'study', slot: 'afternoon',
      minutes: 10, stars: 3, days: [1, 2, 3, 4, 5],
      title: { yue: '執書包', zh: '收拾书包', en: 'Pack the School Bag' },
      steps: [
        ['倒晒書包嘢出嚟', '把书包里的东西全部倒出来', 'Tip everything out of your school bag', '📚'],
        ['睇時間表聽日科目', '看看时间表，明天有什么科目', 'Check the timetable for tomorrow', '📅'],
        ['逐科書簿放入大格', '一科一科把书簿放进大格', 'Put in the books for each subject', '📖'],
        ['檢查文具：筆、擦膠、尺', '检查文具：笔、橡皮、尺子', 'Check your stationery: pen, eraser and ruler', '✏️'],
        ['功課回條放文件夾', '功课和回条放进文件夹', 'Put your homework and notes in the folder', '📄'],
        ['拉好拉鏈，書包企門口', '拉好拉链，书包放在门口', 'Zip it up and stand your bag by the door', '🚪']
      ]
    },
    {
      id: 'homework', icon: '✏️', cat: 'study', slot: 'afternoon',
      minutes: 25, stars: 5, days: [1, 2, 3, 4, 5],
      title: { yue: '做功課', zh: '做功课', en: 'Homework Time' },
      steps: [
        ['清枱面，只留功課文具', '清理桌面，只留下功课和文具', 'Clear the desk, keep only homework and stationery', '🧹'],
        ['睇清單，揀第一樣做', '看看清单，选第一样来做', 'Look at the list and pick the first one', '📝'],
        ['開計時器，專心做', '打开计时器，专心做功课', 'Start the timer and focus', '⏱️'],
        ['做完一科，剔一剔休息', '做完一科，打个勾，休息一下', 'Finish one subject, tick it off, take a break', '☑️'],
        ['全部做完，自己檢查一次', '全部做完后，自己检查一次', 'When all are done, check them yourself', '🔍'],
        ['功課放入書包', '把功课放进书包', 'Put your homework into the school bag', '🎒']
      ]
    },
    {
      id: 'revision', icon: '📖', cat: 'study', slot: 'afternoon',
      minutes: 15, stars: 4, days: [1, 2, 3, 4, 5],
      title: { yue: '溫默書／溫習', zh: '温习默写', en: 'Revise & Dictation' },
      steps: [
        ['拎默書簿同生字表', '拿默写簿和生字表', 'Get your dictation book and word list', '📕'],
        ['大聲讀一次出嚟', '大声读一次出来', 'Read them out loud once', '🗣️'],
        ['遮住默一次，自己對', '遮住默写一次，自己对答案', 'Cover it, write from memory, then check', '✍️'],
        ['錯字抄三次', '错的字抄三次', 'Copy each wrong word three times', '🔤'],
        ['家長抽問三個', '请家长抽问三个', 'Ask a parent to test you on three', '👩‍👦'],
        ['收好放入書包', '收好放进书包', 'Pack everything back into your bag', '🎒']
      ]
    },
    {
      id: 'settable', icon: '🍚', cat: 'meal', slot: 'evening',
      minutes: 5, stars: 2, days: [0, 1, 2, 3, 4, 5, 6],
      title: { yue: '食飯前準備', zh: '吃饭前准备', en: 'Set the Table' },
      steps: [
        ['洗手搓泡泡 20 秒', '洗手搓泡泡二十秒', 'Wash your hands with soap for 20 seconds', '🧼'],
        ['拎自己碗、筷、杯', '拿自己的碗、筷子和杯子', 'Get your own bowl, chopsticks and cup', '🥣'],
        ['擺好餐墊', '摆好餐垫', 'Lay out your placemat', '🍽️'],
        ['幫手拎紙巾', '帮忙拿纸巾', 'Help bring the tissues', '🧻'],
        ['坐定，講「開飯啦」', '坐好，说「开饭啦」', 'Sit down and say "Time to eat!"', '😋']
      ]
    },
    {
      id: 'cleartable', icon: '🧽', cat: 'meal', slot: 'evening',
      minutes: 5, stars: 2, days: [0, 1, 2, 3, 4, 5, 6],
      title: { yue: '食完飯收拾', zh: '吃完饭收拾', en: 'Clear the Table' },
      steps: [
        ['食晒碗入面最後一啖', '吃完碗里的最后一口', 'Eat the last bite in your bowl', '🍚'],
        ['碗筷疊好拎入廚房', '碗筷叠好拿进厨房', 'Stack your bowls and take them to the kitchen', '🍜'],
        ['自己隻杯拎入去', '把自己的杯子也拿进去', 'Take your own cup in as well', '🥤'],
        ['用布抹自己枱面', '用抹布擦干净自己的桌面', 'Wipe your own place with a cloth', '🧹'],
        ['垃圾掉入垃圾桶', '把垃圾扔进垃圾桶', 'Throw the rubbish into the bin', '🗑️'],
        ['洗手漱口', '洗手和漱口', 'Wash your hands and rinse your mouth', '🚰']
      ]
    },
    {
      id: 'tidyroom', icon: '🧸', cat: 'home', slot: 'evening',
      minutes: 10, stars: 3, days: [0, 1, 2, 3, 4, 5, 6],
      title: { yue: '執房間／執玩具', zh: '收拾房间／玩具', en: 'Tidy the Room' },
      steps: [
        ['企房中間，睇邊度亂', '站在房间中间，看看哪里乱', 'Stand in the middle and look around', '🧐'],
        ['玩具分類：車、積木、書', '把玩具分类：车、积木、书', 'Sort the toys: cars, blocks and books', '🚗'],
        ['逐類放入對應箱', '一类一类放进对应的箱子', 'Put each type into its own box', '📦'],
        ['書企直放書架', '把书立起来放回书架', 'Stand the books up on the shelf', '📚'],
        ['地下衫拎去污衣籃', '地上的衣服拿去脏衣篮', 'Put clothes on the floor into the laundry basket', '🧺'],
        ['望一望，講「執好啦」', '看一看，说「收拾好啦」', 'Take a look and say "All tidy!"', '✨']
      ]
    },
    {
      id: 'bath', icon: '🛁', cat: 'home', slot: 'bedtime',
      minutes: 15, stars: 3, days: [0, 1, 2, 3, 4, 5, 6],
      title: { yue: '沖涼', zh: '洗澡', en: 'Bath Time' },
      steps: [
        ['準備衫褲同毛巾', '准备好衣服和毛巾', 'Get your clothes and towel ready', '👕'],
        ['開水試溫度', '打开水，试试水温', 'Turn on the water and test the temperature', '🚿'],
        ['洗頭沖水，唔好入眼', '洗头冲水，不要让泡泡进眼睛', 'Wash your hair, keep soap out of your eyes', '🧴'],
        ['沖身搓泡泡', '冲洗身体，搓出泡泡', 'Wash your body with bubbles', '🫧'],
        ['抹乾身，著好衫', '擦干身体，穿好衣服', 'Dry yourself and get dressed', '🧻'],
        ['污衣入籃，毛巾掛好', '脏衣服放进篮子，毛巾挂好', 'Dirty clothes in the basket, hang up the towel', '🧺']
      ]
    },
    {
      id: 'fold', icon: '👕', cat: 'home', slot: 'evening',
      minutes: 8, stars: 3, days: [0, 6],
      title: { yue: '摺衫', zh: '叠衣服', en: 'Fold the Laundry' },
      steps: [
        ['倒衫出嚟，分自己衫', '把衣服倒出来，分出自己的', 'Tip out the laundry and find your own', '🧺'],
        ['拎一件攤平喺枱面', '拿一件摊平放在桌面上', 'Take one item and lay it flat', '👚'],
        ['左摺右摺，再對摺', '左边折右边折，再对折一次', 'Fold left, fold right, then fold in half', '👔'],
        ['逐件疊好一棟', '一件一件叠成一摞', 'Stack them one by one', '🥞'],
        ['放入衣櫃自己格', '放进衣柜自己的那一格', 'Put them in your own drawer', '🗄️'],
        ['襪捲好放入格', '袜子卷好放进格子', 'Roll up your socks and put them away', '🧦']
      ]
    },
    {
      id: 'chores', icon: '🧹', cat: 'home', slot: 'evening',
      minutes: 8, stars: 3, days: [0, 6],
      title: { yue: '幫手做家務', zh: '帮忙做家务', en: 'Help with Chores' },
      steps: [
        ['問家長今日幫咩', '问问家长今天要帮什么忙', 'Ask a parent what you can help with', '🙋'],
        ['準備工具：布／掃把', '准备好工具：抹布或者扫把', 'Get your tools: a cloth or a broom', '🧹'],
        ['做晒自己負責範圍', '把自己负责的范围做完', 'Finish your own area', '✨'],
        ['工具放回原位', '把工具放回原来的位置', 'Put the tools back where they belong', '🧰'],
        ['洗乾淨手', '把手洗干净', 'Wash your hands', '🧼'],
        ['同家長擊掌完成', '和家长击掌，完成了', 'High-five a parent — all done!', '🙌']
      ]
    },
    {
      id: 'feedgin', icon: '🐱', cat: 'special', slot: 'evening',
      minutes: 5, stars: 3, days: [0, 1, 2, 3, 4, 5, 6],
      title: { yue: '餵 GinGin', zh: '喂 GinGin', en: 'Feed GinGin' },
      steps: [
        ['先洗手', '先洗手', 'Wash your hands first', '🧼'],
        ['倒新糧一平匙入碗', '倒一平勺猫粮进碗里', 'Put one scoop of food into the bowl', '🥣'],
        ['洗水碗，換清水', '洗干净水碗，换上清水', 'Clean the water bowl and add fresh water', '💧'],
        ['鏟屎入袋，掉垃圾桶', '把猫砂铲进袋子，扔进垃圾桶', 'Scoop the litter into a bag and bin it', '🧺'],
        ['摸摸 GinGin 講開飯', '摸摸 GinGin，说开饭啦', 'Pat GinGin and say "Dinner time!"', '🐾'],
        ['再洗手，完成', '再洗一次手，完成', 'Wash your hands again — done!', '✋']
      ]
    },
    {
      id: 'fencing', icon: '🤺', cat: 'special', slot: 'afternoon',
      minutes: 8, stars: 3, days: [6],
      title: { yue: '劍擊班行裝準備', zh: '击剑课装备准备', en: 'Fencing Kit' },
      steps: [
        ['打開劍擊袋', '打开击剑包', 'Open your fencing bag', '🎒'],
        ['面罩、手套放入袋', '把面罩和手套放进袋子', 'Put in your mask and glove', '🥅'],
        ['劍檢查好放入袋', '检查好剑，再放进袋子', 'Check your sword and put it in', '🤺'],
        ['劍擊衫褲襪放入', '把击剑衣、裤子和袜子放进去', 'Pack your jacket, pants and socks', '👕'],
        ['水樽裝水，加毛巾', '水壶装好水，再加一条毛巾', 'Fill your bottle and add a towel', '💧'],
        ['拉好拉鏈，袋企門口', '拉好拉链，袋子放在门口', 'Zip it up and stand the bag by the door', '🚪']
      ]
    },
    {
      id: 'bedtime', icon: '🌙', cat: 'special', slot: 'bedtime',
      minutes: 15, stars: 3, days: [0, 1, 2, 3, 4, 5, 6],
      title: { yue: '睡前 Routine', zh: '睡前流程', en: 'Bedtime Routine' },
      steps: [
        ['沖涼刷牙（見任務 9）', '洗澡刷牙（见任务 9）', 'Bath and brush teeth (see task 9)', '🛁'],
        ['著睡衣', '穿上睡衣', 'Put on your pyjamas', '🛌'],
        ['執聽日校服掛門後', '整理好明天的校服，挂在门后', 'Hang tomorrow\'s uniform behind the door', '👔'],
        ['揀一本書或者日記', '选一本书，或者日记本', 'Pick a book or your diary', '📖'],
        ['上床，講今日開心事', '上床，说说今天开心的事', 'Get into bed and share one happy thing', '😊'],
        ['熄燈，講晚安', '熄灯，说晚安', 'Lights off, say good night', '🌙']
      ]
    },
    {
      id: 'reading', icon: '📚', cat: 'special', slot: 'bedtime',
      minutes: 12, stars: 4, days: [0, 1, 2, 3, 4, 5, 6],
      title: { yue: '閱讀／寫日記', zh: '阅读／写日记', en: 'Reading & Diary' },
      steps: [
        ['揀書，坐定開枱燈', '选一本书，坐好，打开台灯', 'Pick a book, sit down, turn on the lamp', '💡'],
        ['計時睇書 10 分鐘', '计时阅读十分钟', 'Read for ten minutes', '⏱️'],
        ['合埋書，講返故事', '合上书，把故事讲一遍', 'Close the book and retell the story', '🗣️'],
        ['日記寫一句或畫一格', '日记写一句话，或者画一格', 'Write one line or draw in your diary', '✏️'],
        ['書放回書架', '把书放回书架', 'Put the book back on the shelf', '📚'],
        ['熄枱燈，完成', '关掉台灯，完成', 'Turn off the lamp — done!', '🌙']
      ]
    }
  ];

  /* ---- 轉成內部資料結構 ---- */
  function buildTasks() {
    return TASK_SEED.map(function (t) {
      return {
        id: t.id,
        icon: t.icon,
        cat: t.cat,
        slot: t.slot,
        minutes: t.minutes,
        stars: t.stars,
        days: t.days.slice(),
        enabled: true,
        custom: false,
        title: t.title,
        steps: t.steps.map(function (s, i) {
          return { id: t.id + '-' + (i + 1), yue: s[0], zh: s[1], en: s[2], icon: s[3], photo: null };
        })
      };
    });
  }

  global.SBS_DATA = {
    CATEGORIES: CATEGORIES,
    SLOTS: SLOTS,
    WEEKDAYS: WEEKDAYS,
    TASK_SEED: TASK_SEED,
    buildTasks: buildTasks
  };
})(window);
