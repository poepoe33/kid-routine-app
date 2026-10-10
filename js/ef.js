/* ============================================================
   「一步一步」— 家長閱讀：執行功能與前額葉發展
   目的：畀家長一個理解小朋友行為嘅角度，多一份包容同體諒。
   語氣：溫暖、同理、唔指責；唔係診斷，係科普。
   ============================================================ */
(function (global) {
  'use strict';

  var S = global.SBS;

  /* ---------------- 共用小標籤 ---------------- */
  var L = {
    yue: {
      meta: '家長閱讀 · 約 5 分鐘',
      backTitle: '家長閱讀',
      beh: '你可能見到',
      why: '背後可能係',
      tryIt: '可以試吓',
      lib: '去任務庫拆步驟',
      rep: '睇週報告',
      home: '返控制台',
      endK: '最後一句'
    },
    zh: {
      meta: '家长阅读 · 约 5 分钟',
      backTitle: '家长阅读',
      beh: '你可能见到',
      why: '背后可能时',
      tryIt: '可以试试',
      lib: '去任务库拆步骤',
      rep: '看周报告',
      home: '回控制台',
      endK: '最后一句'
    },
    en: {
      meta: 'For parents · 5 min read',
      backTitle: 'For parents',
      beh: 'What you might see',
      why: 'What may be going on',
      tryIt: 'What you can try',
      lib: 'Break steps down',
      rep: 'See weekly report',
      home: 'Back to console',
      endK: 'One last thing'
    }
  };

  /* ---------------- 正文內容 ---------------- */
  var C = {

    /* ===================== 廣東話 ===================== */
    yue: {
      hero: {
        t: '佢唔係唔肯，係仲未做到',
        s: '有啲日子，小朋友明明識做、又做過好多次，但今日就係做唔到。呢度唔係要你改變佢，係想畀你一個角度：好多時唔係態度問題，而係腦入面一個仲未起好嘅部分，叫做執行功能。'
      },
      secs: [
        {
          icon: '🧠',
          h: '執行功能係乜？三個主角',
          blocks: [
            { t: 'p', x: '執行功能（Executive Function）係腦入面一組「管理自己」嘅能力：諗清楚要做乜、忍住唔做唔應該做嘅、記住自己做緊邊一步。大人做慣咗覺得好自然，但對小朋友嚟講，每一步都係要用力嘅。' },
            {
              t: 'h3', x: '工作記憶', en: 'Working memory',
              p: '即係腦入面嗰張「便條紙」。你講「去換衫、執書包、再刷牙」，佢要一路行一路記住呢三件事，途中仲要忍住唔好被玩具吸走。呢張紙唔單止細，仲好易被擦走。佢「唔記得」，好多時係因為張紙唔夠位，唔係因為佢唔上心。'
            },
            {
              t: 'h3', x: '衝動控制', en: 'Impulse control / Inhibitory control',
              p: '即係「想做嗰吓，停得一停」。見到想玩就即刻想玩、未輪到自己就想出聲、做唔到就想發脾氣——忍住呢啲，要靠一個專門嘅系統出力，而呢個系統喺小朋友身上仲練緊。'
            },
            {
              t: 'h3', x: '計劃能力', en: 'Planning',
              p: '即係由「我要執好書包」變成「先放功課，再放課本，最後放水壺」。要估到有幾多嘢做、邊樣先邊樣後、大概要幾耐。大人日日做所以唔覺難，小朋友第一次面對，其實係一條全新嘅題目。'
            }
          ]
        },
        {
          icon: '🌱',
          h: '前額葉：腦入面嘅總指揮',
          blocks: [
            {
              t: 'p',
              x: '上面呢三種能力，主要都靠額頭後面一塊叫<b>前額葉</b>（Prefrontal cortex）嘅地方。佢係腦入面<b>最後先成熟</b>嘅部分之一——所以小朋友唔係「唔夠叻」，係硬件仲起到一半。'
            },
            {
              t: 'tl', items: [
                { age: '幼兒期', x: '已經開始運作，但好唔穩定。要大人喺旁邊「借個腦」畀佢用：幫佢記、幫佢排、幫佢停。' },
                { age: '小學階段', x: '工作記憶同衝動控制慢慢進步，可以跟到兩三步嘅指示。但仍然容易因為攰、肚餓、興奮而「斷線」。' },
                { age: '青春期', x: '腦再大改裝，負責情緒同獎賞嘅部分跑得好快，但負責煞車嘅前額葉仲未跟上——所以會一時衝動、一時唔理後果。' },
                { age: '大約廿五歲前後', x: '先至大致成熟。換句話講，呢條路有十幾二十年咁長。' }
              ]
            },
            {
              t: 'note',
              x: '可以咁諗：小朋友部車嘅引擎（情緒、衝動、想要）已經好夠力，但煞車皮（前額葉）仲磨合緊。佢唔係想撞車，係腳踩咗落去，煞車仲未咬實。'
            },
            {
              t: 'note',
              x: '仲有一點好重要：<b>前額葉好睇狀態</b>。攰、肚餓、病咗、轉環境、太興奮，都會令佢「收工」。所以同一個小朋友，朝早做到、放學後做唔到，唔係退步，係狀態唔同。'
            }
          ]
        },
        {
          icon: '🔍',
          h: '日常行為，背後其實係咁',
          blocks: [
            { t: 'p', x: '下面幾種情況，幾乎每個家庭都見過。佢哋唔係「扭計」，多數都對應住某一項仲未長好嘅能力。' },
            {
              t: 'ex',
              beh: '叫佢執書包，行到房門口就玩咗公仔，好似完全唔記得你講過咩。',
              why: '工作記憶。三個指令一齊落，已經超出嗰張便條紙嘅位；中途嘅玩具又即刻將佢擦走晒。',
              tryIt: '一次只講一步，講完請佢講一次畀你聽；或者貼張圖喺門口，等佢唔使自己記。'
            },
            {
              t: 'ex',
              beh: '排隊、輪流玩、等人講完——全部忍唔住，成日插隊或者搶住講。',
              why: '衝動控制。等待對佢嚟講係真實嘅困難，唔係自私或者冇禮貌。',
              tryIt: '畀佢等嗰陣有嘢做住：數 1 到 10、揸住個計時器。忍到就即刻講：「你忍到，呢個好難㗎。」'
            },
            {
              t: 'ex',
              beh: '執書包執極都漏嘢，做功課次序亂晒，望住一大堆嘢唔知點開始。',
              why: '計劃能力。佢唔係懶，係望住成個任務，唔知由邊度入手。',
              tryIt: '同佢一齊列三格：第一、第二、第三，做完一格剔一格。起步點你先畀，慢慢交返畀佢。'
            },
            {
              t: 'ex',
              beh: '琴日自己做到，今日又喊又唔肯，好似忽得忽失。',
              why: '發展中嘅前額葉 + 當下狀態。呢個係最常見、亦最容易被誤會成「扭計」嘅一種。',
              tryIt: '先照顧狀態：飲口水、休息一陣。再做唔到，就今日減一步，唔使硬撐。'
            }
          ]
        },
        {
          icon: '💛',
          h: '每個小朋友嘅速度都唔同',
          blocks: [
            { t: 'p', x: '發展唔係賽跑。同一個小朋友，唔同日、唔同時段、唔同心情都可以差好遠；何況係兩個唔同嘅人。' },
            { t: 'p', x: '同兄弟姊妹、同班同學比，通常只會換嚟兩個結果：你會更燥，佢會覺得自己「有問題」。呢兩樣都幫唔到執行功能長好。' },
            { t: 'p', x: '有啲小朋友確實需要多啲時間——例如專注力方面嘅特質、自閉特質、早產，或者成長入面經歷過大變動。<b>「需要多啲時間」唔等於「唔夠好」</b>，只係路線唔同。' },
            {
              t: 'note',
              x: '如果呢啲困難長時間、明顯影響到學習、生活同關係，搵專業人士（例如臨床心理學家、兒科醫生、職業治療師）傾吓，係一個支援，唔係一個標籤。你最了解自己個小朋友，你嘅觀察好有價值。'
            }
          ]
        },
        {
          icon: '🏠',
          h: '屋企可以點幫：十個細細步',
          blocks: [
            { t: 'p', x: '唔使全套做齊。揀一兩項你覺得最易入手嘅，做一個禮拜，睇吓有冇唔同。' },
            { t: 'tip', h: '一次一步', x: '講完一句，停三秒，等佢吸收。比起「快啲啦」，靜默更加有用。' },
            { t: 'tip', h: '請佢覆述', x: '「你話畀我聽，第一步係咩？」覆述得到，先算入到腦。' },
            { t: 'tip', h: '貼出嚟', x: '圖加大字，貼喺佢會經過嘅地方。唔使自己記，就唔會唔記得。' },
            { t: 'tip', h: '拆細啲', x: '你以為嘅一步，可能係佢嘅三步。拆到佢一睇就知要做乜。' },
            { t: 'tip', h: '預告轉變', x: '「再玩兩次就食飯」「仲有三分鐘」，加個計時器，等佢有心理準備。' },
            { t: 'tip', h: '練吓等待', x: '輪流遊戲、數 1 到 10 先輪到佢。等待係練得到嘅，忍到就即刻肯定。' },
            { t: 'tip', h: '做前講計劃', x: '「你嘅計劃係咩？先做邊樣？」三分鐘就夠，做完再回顧一次。' },
            { t: 'tip', h: '讚過程唔係結果', x: '「你自己記住咗第一步」——講你見到嘅，好過一句「你好叻」。' },
            { t: 'tip', h: '揀啱時間', x: '食飽、休息夠先做最難嗰樣。放學後同臨瞓前，唔好開新任務。' },
            { t: 'tip', h: '你都要顧自己', x: '你攰嘅時候，佢嘅執行功能都會差啲。照顧自己唔係自私，係策略。' }
          ]
        },
        {
          icon: '📱',
          h: '呢個 App 係點樣對應嘅',
          blocks: [
            { t: 'p', x: '「一步一步」嘅設計，其實就係將上面嘅道理變成小朋友撳得到嘅嘢：' },
            {
              t: 'ul', items: [
                '<b>一步一屏</b>：唔使靠工作記憶記住成個流程，每次只需處理一件事。',
                '<b>固定次序、固定圖示</b>：減少計劃負擔，佢會知道跟住落嚟係咩。',
                '<b>長按 1 秒先完成</b>：畀佢一個「停一停」嘅位，練習衝動控制。',
                '<b>「我唔識」求助掣</b>：卡住嗰步會記喺週報告，幫你睇到係邊一類能力要幫，而唔係佢唔聽話。',
                '<b>週報告嘅「最常卡住」</b>：用嚟拆細步驟，唔係用嚟評分。'
              ]
            }
          ]
        }
      ],
      end: '喺佢做到之前，你嘅平靜、你嘅次序、你嘅肯定，就係佢借緊嘅嗰一副腦。慢慢嚟，一步一步。'
    },

    /* ===================== 書面語（普通話） ===================== */
    zh: {
      hero: {
        t: '他不是不肯，是还没做到',
        s: '有些日子，孩子明明会做、也做过很多次，但今天就是做不到。这里不是要你改变他，而是想给你一个角度：很多时候不是态度问题，而是脑子里一个还没建好的部分，叫做执行功能。'
      },
      secs: [
        {
          icon: '🧠',
          h: '执行功能是什么？三个主角',
          blocks: [
            { t: 'p', x: '执行功能（Executive Function）是脑里一组「管理自己」的能力：想清楚要做什么、忍住不做不该做的、记住自己做到哪一步。大人做惯了觉得很自然，但对孩子来说，每一步都是要花力气的。' },
            {
              t: 'h3', x: '工作记忆', en: 'Working memory',
              p: '就是脑里那张「便条纸」。你说「去换衣服、收书包、再刷牙」，他要一路走一路记住这三件事，途中还要忍住不被玩具吸走。这张纸不但小，还很容易被擦掉。他「不记得」，很多时候是因为纸不够位置，不是因为他不上心。'
            },
            {
              t: 'h3', x: '冲动控制', en: 'Impulse control / Inhibitory control',
              p: '就是「想做的那一刻，能停一停」。看到想玩就马上想玩、还没轮到自己就想说话、做不到就想发脾气——忍住这些，要靠一个专门的系统出力，而这个系统在孩子身上还在练。'
            },
            {
              t: 'h3', x: '计划能力', en: 'Planning',
              p: '就是把「我要收好书包」变成「先放作业，再放课本，最后放水壶」。要估计有多少事要做、哪样先哪样后、大概要多久。大人天天做所以不觉难，孩子第一次面对，其实是一条全新的题目。'
            }
          ]
        },
        {
          icon: '🌱',
          h: '前额叶：脑里的总指挥',
          blocks: [
            {
              t: 'p',
              x: '上面这三种能力，主要都靠额头后面一块叫<b>前额叶</b>（Prefrontal cortex）的地方。它是脑里<b>最后才成熟</b>的部分之一——所以孩子不是「不够聪明」，是硬件还在建一半。'
            },
            {
              t: 'tl', items: [
                { age: '幼儿期', x: '已经开始运作，但很不稳定。要大人在旁边「借个脑」给他用：帮他记、帮他排、帮他停。' },
                { age: '小学阶段', x: '工作记忆和冲动控制慢慢进步，可以跟到两三步的指示。但仍然容易因为累、饿、兴奋而「断线」。' },
                { age: '青春期', x: '脑再次大改装，负责情绪和奖赏的部分跑得很快，但负责煞车的前额叶还没跟上——所以会一时冲动、一时不顾后果。' },
                { age: '大约二十五岁前后', x: '才大致成熟。换句话说，这条路有十几二十年那么长。' }
              ]
            },
            {
              t: 'note',
              x: '可以这样想：孩子这部车的引擎（情绪、冲动、想要）已经很有力，但煞车皮（前额叶）还在磨合。他不是想撞车，是脚踩下去了，煞车还没咬紧。'
            },
            {
              t: 'note',
              x: '还有一点很重要：<b>前额叶很看状态</b>。累、饿、生病、换环境、太兴奋，都会让它「下班」。所以同一个孩子，早上做得到、放学后做不到，不是退步，是状态不同。'
            }
          ]
        },
        {
          icon: '🔍',
          h: '日常行为，背后其实是这样',
          blocks: [
            { t: 'p', x: '下面几种情况，几乎每个家庭都见过。它们不是「闹脾气」，多数都对应着某一项还没长好的能力。' },
            {
              t: 'ex',
              beh: '叫他收书包，走到房门口就玩起了玩具，好像完全不记得你说过什么。',
              why: '工作记忆。三个指令一起下，已经超出那张便条纸的位置；途中的玩具又立刻把它擦掉了。',
              tryIt: '一次只讲一步，讲完请他讲一次给你听；或者贴张图在门口，让他不用自己记。'
            },
            {
              t: 'ex',
              beh: '排队、轮流玩、等人说完——全部忍不住，常常插队或者抢着说话。',
              why: '冲动控制。等待对他来说是真实的困难，不是自私或者没礼貌。',
              tryIt: '让他等的时候有事情做：数 1 到 10、拿着计时器。忍到了就立刻说：「你忍住了，这很难的。」'
            },
            {
              t: 'ex',
              beh: '收书包总是漏东西，做功课次序乱七八糟，看着一大堆事不知从何开始。',
              why: '计划能力。他不是懒，是看着整个任务，不知道从哪里下手。',
              tryIt: '和他一起列三格：第一、第二、第三，做完一格划一格。起点你先给，慢慢交回给他。'
            },
            {
              t: 'ex',
              beh: '昨天自己做得到，今天又哭又不肯，好像时好时坏。',
              why: '发展中的前额叶 + 当下状态。这是最常见、也最容易被误会成「闹脾气」的一种。',
              tryIt: '先照顾状态：喝口水、休息一下。再做不到，就今天减一步，不用硬撑。'
            }
          ]
        },
        {
          icon: '💛',
          h: '每个孩子的速度都不一样',
          blocks: [
            { t: 'p', x: '发展不是赛跑。同一个孩子，不同的日子、不同的时段、不同的心情都可以差很远；何况是两个不同的人。' },
            { t: 'p', x: '和兄弟姐妹、和同班同学比，通常只会换来两个结果：你会更烦躁，他会觉得自己「有问题」。这两样都帮不到执行功能长好。' },
            { t: 'p', x: '有些孩子确实需要多一点时间——例如专注力方面的特质、自闭特质、早产，或者成长里经历过大的变动。<b>「需要多一点时间」不等于「不够好」</b>，只是路线不同。' },
            {
              t: 'note',
              x: '如果这些困难长时间、明显影响到学习、生活和关系，找专业人士（例如临床心理学家、儿科医生、职业治疗师）聊一聊，是一种支持，不是一个标签。你最了解自己的孩子，你的观察很有价值。'
            }
          ]
        },
        {
          icon: '🏠',
          h: '在家里可以这样帮：十个小步',
          blocks: [
            { t: 'p', x: '不用全套做完。挑一两项你觉得最容易入手的，做一个礼拜，看看有没有不同。' },
            { t: 'tip', h: '一次一步', x: '讲完一句，停三秒，等他吸收。比起「快一点啦」，安静更有用。' },
            { t: 'tip', h: '请他复述', x: '「你告诉我，第一步是什么？」复述得到，才算进了脑子。' },
            { t: 'tip', h: '贴出来', x: '图加大字，贴在他会经过的地方。不用自己记，就不会不记得。' },
            { t: 'tip', h: '拆细一点', x: '你以为的一步，可能是他的三步。拆到他一看就知道要做什么。' },
            { t: 'tip', h: '预告转变', x: '「再玩两次就吃饭」「还有三分钟」，加个计时器，让他有心理准备。' },
            { t: 'tip', h: '练练等待', x: '轮流游戏、数 1 到 10 才轮到他。等待是练得出来的，忍到就立刻肯定。' },
            { t: 'tip', h: '做前讲计划', x: '「你的计划是什么？先做哪样？」三分钟就够，做完再回顾一次。' },
            { t: 'tip', h: '赞过程不是结果', x: '「你自己记住了第一步」——说你看到的，好过一句「你真棒」。' },
            { t: 'tip', h: '挑对时间', x: '吃饱、休息够才做最难的那件事。放学后和临睡前，不要开新任务。' },
            { t: 'tip', h: '你也要照顾自己', x: '你累的时候，他的执行功能也会差一点。照顾自己不是自私，是策略。' }
          ]
        },
        {
          icon: '📱',
          h: '这个 App 是怎么对应的',
          blocks: [
            { t: 'p', x: '「一步一步」的设计，其实就是把这些道理变成孩子按得到的东西：' },
            {
              t: 'ul', items: [
                '<b>一步一屏</b>：不用靠工作记忆记住整个流程，每次只需处理一件事。',
                '<b>固定次序、固定图标</b>：减少计划负担，他会知道接下来是什么。',
                '<b>长按 1 秒才完成</b>：给他一个「停一停」的位置，练习冲动控制。',
                '<b>「我不会」求助键</b>：卡住那一步会记在周报告里，帮你看是哪一类能力要帮，而不是他不听话。',
                '<b>周报告的「最常卡住」</b>：用来拆细步骤，不是用来评分。'
              ]
            }
          ]
        }
      ],
      end: '在他做到之前，你的平静、你的次序、你的肯定，就是他正在借的那副脑。慢慢来，一步一步。'
    },

    /* ===================== English ===================== */
    en: {
      hero: {
        t: "It is not refusal. It is not-yet.",
        s: "Some days a child knows exactly how to do something, has done it a hundred times, and still cannot do it today. This page is not here to change your child. It offers a different lens: very often this is not about attitude, but about a part of the brain that is still under construction, called executive function."
      },
      secs: [
        {
          icon: "🧠",
          h: "What is executive function? The three main characters",
          blocks: [
            { t: "p", x: "Executive function is a set of self-management skills in the brain: working out what to do, holding back what should not be done, and keeping track of where you are in a task. Adults do this so automatically that it feels like nothing. For a child, every piece of it takes real effort." },
            {
              t: "h3", x: "Working memory", en: "",
              p: "Think of it as a small sticky note inside the head. You say: \"get dressed, pack your bag, then brush your teeth.\" Your child has to hold all three while walking down the hall, and resist the toy on the way. The note is small and wipes clean very easily. Forgetfulness is usually a note that ran out of room, not a child who could not care less."
            },
            {
              t: "h3", x: "Impulse control", en: "also called inhibitory control",
              p: "This is the ability to pause at the moment of wanting. To want to play and not grab it, to wait for a turn, to feel frustrated and not explode. Holding all of that back takes a dedicated system, and in children that system is still in training."
            },
            {
              t: "h3", x: "Planning", en: "",
              p: "This turns \"I need to pack my bag\" into \"first homework, then textbooks, then the water bottle.\" It means estimating how much there is, what comes first, and how long it takes. Adults do it daily and forget it is hard. For a child meeting it for the first time, it is a brand new problem."
            }
          ]
        },
        {
          icon: "🌱",
          h: "The prefrontal cortex: the conductor",
          blocks: [
            {
              t: "p",
              x: "All three of these rely mainly on an area just behind the forehead called the <b>prefrontal cortex</b>. It is one of the <b>last parts of the brain to mature</b>. A child who struggles is not failing at being smart; the hardware is still half built."
            },
            {
              t: "tl", items: [
                { age: "Early childhood", x: "It is running, but very unsteadily. A adult has to lend their brain: remembering, sequencing, and pausing on the child's behalf." },
                { age: "Primary school years", x: "Working memory and impulse control improve steadily; two or three step instructions become possible. But tiredness, hunger and excitement still knock it offline." },
                { age: "Adolescence", x: "The brain is rewired again. The parts handling emotion and reward run fast, while the braking system has not caught up, so impulses arrive before consequences are considered." },
                { age: "Around the mid-twenties", x: "It is broadly mature. In other words, this is a road that runs for two decades or more." }
              ]
            },
            {
              t: "note",
              x: "One way to picture it: the engine (emotion, impulse, wanting) is already powerful, but the brake pads are still being bedded in. Your child is not trying to crash. The foot went down and the brakes had not gripped yet."
            },
            {
              t: "note",
              x: "One more thing matters a great deal: <b>the prefrontal cortex is highly state-dependent</b>. Tired, hungry, unwell, in a new place, or overexcited, and it clocks off. So the same child managing something in the morning and not after school is not regressing. The state simply changed."
            }
          ]
        },
        {
          icon: "🔍",
          h: "Everyday behaviour, and what sits underneath",
          blocks: [
            { t: "p", x: "Almost every family has seen the following. They are not acts of defiance; most of them map onto one specific skill that is still growing." },
            {
              t: "ex",
              beh: "Asked to pack a school bag, they reach the doorway and start playing with a toy, apparently having forgotten everything you said.",
              why: "Working memory. Three instructions at once overflow the sticky note, and the toy on the way wipes whatever was left.",
              tryIt: "Give one step at a time and ask them to repeat it back. Or put a picture on the door so they do not have to remember at all."
            },
            {
              t: "ex",
              beh: "Queuing, taking turns, waiting for someone to finish speaking: they cannot hold it, and push in or talk over people.",
              why: "Impulse control. Waiting is a genuine difficulty for them, not selfishness or rudeness.",
              tryIt: "Give them something to do while waiting: count to ten, hold the timer. The moment they manage it, say: \"You waited. That is hard.\""
            },
            {
              t: "ex",
              beh: "The bag never gets fully packed, homework is out of order, and they stare at a pile of things with no idea where to begin.",
              why: "Planning. Not laziness. They are looking at a whole task and cannot find the entry point.",
              tryIt: "Build three boxes together: first, second, third, and tick each one off. You supply the starting point at first, then hand it over."
            },
            {
              t: "ex",
              beh: "They managed it independently yesterday, and today there are tears and refusal. It looks inconsistent.",
              why: "A prefrontal cortex still under construction, plus the state of the moment. This is the most common pattern and the most often misread as defiance.",
              tryIt: "Tend to the state first: water, a rest. If it still will not happen, drop a step today. No need to push through."
            }
          ]
        },
        {
          icon: "💛",
          h: "Every child moves at their own pace",
          blocks: [
            { t: "p", x: "Development is not a race. The same child can look completely different on different days, at different hours, in different moods. Two different children are a far wider gap still." },
            { t: "p", x: "Comparing them with a sibling or a classmate usually produces only two outcomes: you get more frustrated, and they conclude something is wrong with them. Neither helps executive function grow." },
            { t: "p", x: "Some children genuinely need more time, for example those with attention-related profiles, autistic traits, premature birth, or major upheaval in their early years. <b>Needing more time is not the same as being less worthy.</b> It is simply a different route." },
            {
              t: "note",
              x: "If these difficulties persist and clearly affect learning, daily life and relationships, talking to a professional such as a clinical psychologist, paediatrician or occupational therapist is support, not a label. You know your child best, and your observations carry real weight."
            }
          ]
        },
        {
          icon: "🏠",
          h: "Ten small things to try at home",
          blocks: [
            { t: "p", x: "You do not need to do all of them. Pick one or two that feel easiest, try them for a week, and see what shifts." },
            { t: "tip", h: "One step at a time", x: "Say one sentence, then pause for three seconds. Silence works better than \"hurry up\"." },
            { t: "tip", h: "Ask them to repeat it", x: "\"Tell me, what is the first step?\" If they can repeat it, it has actually landed." },
            { t: "tip", h: "Put it on the wall", x: "A picture plus big words, somewhere they walk past. Remove the need to remember and forgetfulness drops." },
            { t: "tip", h: "Break it smaller", x: "What looks like one step to you may be three to them. Break it until it is obvious at a glance." },
            { t: "tip", h: "Warn before transitions", x: "\"Two more turns, then dinner.\" \"Three minutes left.\" Add a timer so they can prepare inside." },
            { t: "tip", h: "Practise waiting", x: "Turn-taking games, counting to ten before their go. Waiting can be trained; notice it the moment it happens." },
            { t: "tip", h: "Say the plan first", x: "\"What is your plan? What comes first?\" Three minutes is enough. Review it briefly afterwards." },
            { t: "tip", h: "Praise the process", x: "\"You remembered the first step yourself.\" Describe what you saw rather than rating how clever they are." },
            { t: "tip", h: "Choose the moment", x: "Save the hard task for fed and rested. After school and just before bed are poor times to launch something new." },
            { t: "tip", h: "Look after yourself too", x: "When you are depleted, their executive function suffers as well. Caring for yourself is not selfish. It is strategy." }
          ]
        },
        {
          icon: "📱",
          h: "How this app fits in",
          blocks: [
            { t: "p", x: "Step by Step is essentially these ideas turned into something a child can tap:" },
            {
              t: "ul", items: [
                "<b>One step per screen</b>: no need to hold a whole sequence in working memory.",
                "<b>Fixed order, fixed icons</b>: less planning load, because what comes next is already known.",
                "<b>A one-second hold to confirm</b>: a built-in pause, which is impulse control practice.",
                "<b>The \"I need help\" button</b>: the sticking step shows up in the weekly report, so you can see which skill needs support rather than assuming defiance.",
                "<b>\"Where they get stuck\"</b>: a prompt to break steps down, not a score."
              ]
            }
          ]
        }
      ],
      end: "Until they can do it, your calm, your order and your noticing are the brain they are borrowing. Take it slowly. One step at a time."
    }
  };

  /* ---------------- 渲染 ---------------- */
  /* h3 + 段落係多個根元素，必須用 appendHTML，唔可以用 S.el */
  function h3Block(b) {
    var wrapEl = S.el('<div></div>');
    S.appendHTML(wrapEl,
      '<h3 class="ef-h3">' + b.x +
      (b.en ? '<span class="ef-en">' + b.en + '</span>' : '') +
      '</h3><p class="ef-p">' + b.p + '</p>');
    return wrapEl;
  }

  function blockNode(b, l) {
    if (b.t === 'p') {
      return S.el('<p class="ef-p">' + b.x + '</p>');
    }
    if (b.t === 'h3') {
      return h3Block(b);
    }
    if (b.t === 'ul') {
      return S.el('<ul class="ef-ul">' + b.items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul>');
    }
    if (b.t === 'note') {
      return S.el('<div class="ef-note">' + b.x + '</div>');
    }
    if (b.t === 'tl') {
      return S.el('<ul class="ef-tl">' + b.items.map(function (i) {
        return '<li><div class="age">' + i.age + '</div><div class="x">' + i.x + '</div></li>';
      }).join('') + '</ul>');
    }
    if (b.t === 'ex') {
      return S.el('<div class="ef-ex">' +
        '<div class="k">' + l.beh + '</div><div class="v">' + b.beh + '</div>' +
        '<div class="k">' + l.why + '</div><div class="v">' + b.why + '</div>' +
        '<div class="k">' + l.tryIt + '</div><div class="v try">' + b.tryIt + '</div>' +
        '</div>');
    }
    if (b.t === 'tip') {
      return S.el('<div class="ef-tip"><div class="n">' + b.n + '</div>' +
        '<div><div class="h">' + b.h + '</div><div class="x">' + b.x + '</div></div></div>');
    }
    return S.el('<div></div>');
  }

  function view() {
    var c = C[S.lang()] || C.yue;
    var l = L[S.lang()] || L.yue;

    var head = S.topbar({
      parent: true,
      title: l.backTitle,
      back: function () { S.go('/parent/home'); }
    });

    var body = S.el('<div class="wrap" style="max-width:720px"></div>');

    body.appendChild(S.el(
      '<div class="ef-hero"><div class="ef-meta">' + l.meta + '</div>' +
      '<div class="t">' + c.hero.t + '</div>' +
      '<div class="s">' + c.hero.s + '</div></div>'
    ));

    c.secs.forEach(function (sec) {
      var card = S.el('<section class="ef-sec"><h2><span>' + sec.icon + '</span><span>' + sec.h + '</span></h2></section>');
      var tipNo = 0;
      sec.blocks.forEach(function (b) {
        if (b.t === 'tip') { tipNo++; b = { t: 'tip', n: tipNo, h: b.h, x: b.x }; }
        card.appendChild(blockNode(b, l));
      });
      body.appendChild(card);
    });

    body.appendChild(S.el(
      '<div class="ef-sec ef-end"><div class="k" style="font-size:12px;font-weight:800;letter-spacing:.6px;color:var(--ink-soft)">' +
      l.endK + '</div><div class="q mt8">' + c.end + '</div></div>'
    ));

    var links = S.el('<div class="ef-links"></div>');
    var a = S.el('<a class="btn btn-soft" href="#/parent/tasks">' + l.lib + '</a>');
    var b2 = S.el('<a class="btn btn-ghost" href="#/parent/report">' + l.rep + '</a>');
    links.appendChild(a); links.appendChild(b2);
    body.appendChild(links);

    var home = S.el('<a class="btn btn-primary btn-block mt16" href="#/parent/home">' + l.home + '</a>');
    body.appendChild(home);

    body.appendChild(S.el('<div class="small muted mt16 center" style="line-height:1.7;padding-bottom:8px">' +
      S.tx({
        yue: '呢篇係科普小品，唔係醫療或心理評估。每個小朋友都係獨一無二嘅。',
        zh: '这篇是科普小品，不是医疗或心理评估。每个孩子都是独一无二的。',
        en: 'This is a plain-language introduction, not a medical or psychological assessment. Every child is unique.'
      }) + '</div>'));

    var v = S.el('<div class="view"></div>');
    v.appendChild(head);
    v.appendChild(body);
    return v;
  }

  function register(route) {
    route('/parent/understand', view);
  }

  global.SBS_EF = { register: register, view: view };
})(window);
