// script.js
        const maxLevel = 6;
        let currentDescriptionIndex = 0;

// レベルごとの説明文リスト（複数のスライド）
        const levelDescriptions = {
            1: [
                "原子番号1～20番の元素記号が襲来<br>入力は半角英数のみ<br>1文字目は大文字<br>2文字目は小文字<br>入力したら発射ボタンで迎撃<br>準備ができたら開始ボタンを押せ！"
            ],
            2: [
                "原子番号21～36番の元素記号が襲来<br>中学の知識では撃墜できない<br>高校での実力を発揮せよ<br>準備ができたら開始ボタンを押せ！"
            ],
            3: [
                "原子番号38番以降の元素記号が襲来<br>勉強していないと全問撃墜は不能<br>準備ができたら開始ボタンを押せ！"
            ],
            4: [
                "今度はイオン式，入力大変だぞ<br>文字を入力して上付ボタンを押すと<br>直前の1文字だけ上付きになる<br>準備ができたら開始ボタンを押せ！"
            ],
            5: [
                "難しいぞ！元素記号右上の数字暗記は？<br>原子番号24番以降のイオン式<br>文字を入力して上付ボタンを押すと<br>直前の1文字だけ上付きになる<br>準備ができたら開始ボタンを押せ！"
            ],
            6: [
                "よくぞここまで来た<br>多原子イオンがついに降臨<br>今度は下付もあるぞ<br>準備ができたら開始ボタンを押せ！"
            ]
        };

        //クイズデータ
let quizLevels = {
  1: [
        { name: "水素", formula: "H" },
        { name: "ヘリウム", formula: "He" },
        { name: "リチウム", formula: "Li" },
     
    ],
  2: [
        { name: "臭素", formula: "Br" },
        { name: "クリプトン", formula: "Kr" },
  ],
  3: [
        { name: "鉛", formula: "Pb" },
        { name: "ウラン", formula: "U" },
  ],
  4: [
        { name: "水素イオン", formula: "H+^" },
        { name: "リチウムイオン", formula: "Li+^" },

  ],
  5: [
        { name: "水銀(Ⅱ)イオン", formula: "Hg2^+^" },
        { name: "鉛(Ⅱ)イオン", formula: "Pb2^+^" },
  ],
  6: [
        { name: "水酸化物イオン", formula: "OH-^" },
        { name: "アンモニウムイオン", formula: "NH4_+^" },
    ]
  };

// 各レベルの曲のリスト
const musicTracks = [
    "level1.mp3", // レベル 1
    "level2.mp3", // レベル 2
    "level3.mp3", // レベル 3
    "level4.mp3", // レベル 4
    "level5.mp3", // レベル 5
    "level6.mp3"  // レベル 6
];
const volumeLevels = [
    1.0, // レベル 1 の音量（最大）
    1.0, // レベル 2
    1.0, // レベル 3
    1.0, // レベル 4
    1.0, // レベル 5
    1.0  // レベル 6（ちょっと大きめ）
];
  //定数の宣言
  let audio = new Audio(); // 音楽プレイヤー

    const inputTextInput = document.getElementById('inputText');    //入力欄
    const formattedAnswer = document.getElementById("formatted-answer");//フォーマットされた解答
    const fallingText = document.getElementById('fallingText');     //落下文字
    const risingText = document.getElementById('risingText');       //上昇文字
    const fireButton = document.getElementById('fireButton');       //発射ボタン
    const fireSound = document.getElementById('fireSound');         // 発射音
    const explosionSound = document.getElementById('explosionSound');// 爆発音
    const hazureSound = document.getElementById('hazureSound');// 爆発音
    const nextButton = document.getElementById('nextButton');       // 次のボタン   
    const timeOverSound = document.getElementById('timeOverSound');  // 時間切れ音
    
    
    const timeoutMessage = document.getElementById("timeout-message");//時間切れメッセージ
    const correctFormula = document.getElementById('correctFormula'); //正解
//初期設定
    const totalFallSteps = 200;//落下ステップ数
    const fallDuration = 20000;//落下時間
    const fallStepDuration = fallDuration / totalFallSteps;//落下ステップ時間
    const maxFallHeight = 41; // 🔴 最大落下範囲を 31% に制限(発射文字と被らせないため)
    const maxRiseHeight = -60; // 🔴 最大上昇範囲を -50% に制限（上方向に動く文字が突き抜ける）
    //🔴formattedAnswerの位置はCSSで
    //🔴risingText.style.bottom = "55%"; で発射文字の下端を設定
    //let isFalling = true;//落下中に設定
    let fallInterval;//落下間隔
    let fallStep = 0;//落下ステップ
    let fallTimeout;//setTimeout ID を保持
    let wrongAnswers = [];//間違えた問題←間違えた問題を再実行用
    let yarinaosiKaisu = 1;
    const container = document.querySelector('.container');//Document の querySelector() メソッドは、
                // 指定されたセレクターまたはセレクター群に一致する、文書内の最初の Element を返します。
                // 一致するものが見つからない場合は null を返します。
    let scatterCount = 0;//散乱カウント
    const maxScatterCount = 3;//最大散乱数
    let risingAnimation;//上昇アニメーション
    fireButton.style.display = "none"; //発射ボタンを非表示
    let score = 0; // スコアの初期化
    let totalScore = 0; //  合計得点
    let timeLeft = 5; // 制限時間（秒）
    let timer; // タイマー変数
    let timeOutCount = 0; // 時間切れの回数をカウント
    let maxLives = 3; //  最大ライフ数
    let quizData = []; // 現在のレベルの問題リスト
    let currentLevel = 1; // 現在のレベル
    let level = 1; // レベル
    let currentQuestionIndex = 0;//現在の問題インデックス

//スタートボタンのクリックイベント  
document.addEventListener("DOMContentLoaded", () => {// htmlやCSSを読み込んだら実行
    const setumeiButton = document.getElementById("setumeiButton");//setumeiボタン
    setumeiButton.addEventListener("click", () => { //説明の次へのボタンクリック時の動作
        levelSetumei(currentLevel); // setumei
        setumeiButton.style.display = "none"; //説明の次へのボタンは非表示
    });
      const startButton = document.getElementById("startButton");       // スタートボタン
      const fireButton = document.getElementById("fireButton");         // 発射ボタン
      const fireSound = document.getElementById("fireSound");           // 発射音
      const explosionSound = document.getElementById("explosionSound"); // 爆発音
      inputTextInput.addEventListener("keypress", (event) => {          // エンターキーで発射するイベントを追加
        if (event.key === "Enter") { // エンターキーが押されたかチェック
            event.preventDefault(); // デフォルトの動作（フォーム送信など）を防ぐ
            fireinputText(); // 文字を発射
        }
      });    
      gameStart();
    });

//そのレベルでの説明        
    function levelSetumei(currentLevel) {//レベル説明
      isFalling = false; // 落下を停止
      showScreen('levelScreen');//レベル説明画面への切り替え
      updateLevelScreen();//レベル説明の内容を読み込み
      startButton.style.display = "block"; // 開始ボタンを表示
      }
//レベルに対応する説明の読み込み
        function updateLevelScreen() {//レベル説明の内容を読み込み
            document.getElementById('levelTitle').innerText = `レベル ${currentLevel}`;//レベル〇の表示
            currentDescriptionIndex = 0;//説明のインデックスをリセット
            const descriptions = levelDescriptions[currentLevel];
            if (currentDescriptionIndex < descriptions.length) {
                document.getElementById('levelDescription').innerHTML = descriptions[currentDescriptionIndex].replace(/\n/g, "<br>");
            } 
        }


//ゲーム画面に切り替え
function startLevel() {
            showScreen('gameScreen');
        }

//画面を切り替えるための関数
function showScreen(id) {//表示したい画面のidを渡す
            document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));//全てのスクリーンを非表示
            document.getElementById(id).classList.add('active');//指定したidだけ表示
        }
  
//ゲームスタート関数
    function gameStart() {
        startButton.addEventListener("click", () => { //スタートボタンクリック時の動作
            yarinaosiKaisu=1
            startButton.style.display = "none"; // 開始ボタンを非表示
            fireButton.style.display = "block"; //発射ボタンを表示
            quizuLevel(level)//クイズレベルの処理
            setVolume(0.1);
            playMusicForLevel(currentLevel);
            


        });
        fireButton.addEventListener("click", () => { // スマホで音が出るようにクリックイベントの中で再生
            fireSound.currentTime = 0; // 音をリセット
            fireSound.play().catch(e => console.error("再生エラー:", e)); // スマホ対応
        });
    }

// 🎵 レベルに応じた音楽を再生
let audioContext;
let audioSource;
let gainNode;

function playMusicForLevel(level) {
  if (level < 1 || level > 6) return;

  if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (audioSource) {
      audioSource.stop();
  }

  const filePath = musicTracks[level - 1];
  console.log("Fetching file:", filePath); // 🔍 パス確認

  fetch(filePath)
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.arrayBuffer();
      })
      .then(data => audioContext.decodeAudioData(data))
      .then(buffer => {
          audioSource = audioContext.createBufferSource();
          gainNode = audioContext.createGain();

          audioSource.buffer = buffer;
          audioSource.loop = true;

          audioSource.connect(gainNode);
          gainNode.connect(audioContext.destination);

          audioSource.start();
      })
      .catch(error => {
          console.error("Error loading music file:", error);
      });
}



// 🎚 音量調整（iOS でも動作）
function setVolume(value) {
if (gainNode) {
   gainNode.gain.setValueAtTime(value, audioContext.currentTime);
}
}



//function playMusicForLevel(level) {
//    if (level < 1 || level > 6) return; // レベル範囲外なら何もしない
//    audio.src = musicTracks[level - 1]; // レベルに対応した曲をセット
    //audio.volume = volumeLevels[level - 1]; // 音量を設定
//    audio.loop = true; // ループ再生
    //console.log(musicTracks[level - 1]);
//    audio.play();
//}

//クイズレベルの処理
function quizuLevel(level) {
        currentLevel = level; // 現在のレベルを記録
        quizData = [...quizLevels[level]]; //  選択したレベルの問題をコピー
        if (level > 3){//レベル3を越えたら上付き下付ボタンを表示する
          superscriptButton.style.display = "block"; //上付きボタンを表示   
          subscriptButton.style.display = "block"; //下付ボタンを表示   
        }      
        currentQuestionIndex = 0;
        score = 0; // スコアの初期化
        wrongAnswers = []; //  間違えた問題をリセット
        gamenRest ();//  画面をリセット
        loadQuestion(); //  クイズの読み込み
}

//画面リセット関数
function gamenRest() {
        document.getElementById("restartButton").style.display = "none";
        document.getElementById("nextlevelButton").style.display = "none";
        document.getElementById("fallingText").style.display = "block";
        document.getElementById("risingText").style.display = "block";
        document.getElementById("inputContainer").style.display = "flex";
        document.getElementById("nextButton").style.display = "block";
        document.getElementById("lifeContainer").style.display = "block";
}

//クイズの読み込み関数
    function loadQuestion() { 
        updateLifeDisplay()//♥の表示更新
        if (currentQuestionIndex >= quizData.length || timeOutCount >= maxLives) {  //全ての問題を終了したら
            endGame(); // ゲーム終了処理へ
        return; // 以降の処理を実行しない
        }
        // `fragment` クラスの不要な文字を削除（前回の散乱をリセット）
        document.querySelectorAll(".fragment").forEach((el) => el.remove());
        const question = quizData[currentQuestionIndex];  //問題を代入
        nextButton.style.display = "none";                //次のボタンを非表示
        fallingText.textContent = question.name;          //落下文字に問題を代入
        fallingText.style.display = "block";              //落下文字を表示
        
        cancelAnimationFrame(moveFallingText); // 前のアニメーションをキャンセル
        fallStep = 0;                                     //落下ステップをリセット
        isFalling = true;                                 //落下中にする
        fallingText.style.top = "0px";//落下位置リセット
        fallingText.style.display = "block";//落下文字表示
        
        document.getElementById("scoreDisplay").textContent = `スコア: ${score}`;//スコアを表示
        
        var roundedtotalScore = totalScore.toFixed(1);
        document.getElementById("totalScoreDisplay").textContent = `Total Score: ${roundedtotalScore}`;; //  得点を表示
        clearInterval(timer);                             // タイマーをリセット
        mojiInput(currentQuestionIndex);                  //文字入力処理へ
        startTimer();                                     //タイマー始動
        lastTimestamp = performance.now(); // 現在の時間を取得
        requestAnimationFrame(moveFallingText); // 落下アニメーション開始
}

//文字入力設定    
function mojiInput(currentQuestionIndex){
        document.getElementById("inputContainer").style.display = "flex";//入力欄を表示
        risingText.innerHTML = "";            // 上昇文字をリセット
        risingText.style.bottom = "45%";      // 🔴位置を画面下端にリセット
        risingText.style.display = 'block';   // 上昇文字を表示
        formattedAnswer.innerHTML  = "";      // 上昇させない解答文字をリセット
        inputTextInput.value = "";            // 入力欄をリセット
        inputTextInput.focus();               // 入力欄にフォーカス
}
//上付きボタンと下付ボタンの処理
    document.getElementById("superscriptButton").addEventListener("click", () => {
        insertText("^");
        updateRisingText(); 
    });
    document.getElementById("subscriptButton").addEventListener("click", () => {
        insertText("_");
        updateRisingText(); 
    });
// 入力欄に文字を挿入する共通関数
function insertText(char) {
    const inputField = document.getElementById("inputText");
    const cursorPosition = inputField.selectionStart; // カーソルの位置を取得
    // カーソル位置に `char` を挿入
    inputField.value = 
        inputField.value.slice(0, cursorPosition) + char + inputField.value.slice(cursorPosition);
    inputField.selectionStart = inputField.selectionEnd = cursorPosition + 1; // カーソルを挿入位置の後ろに移動
    inputField.focus(); // 入力欄にフォーカスを戻す
}

    
// 文字を落下させる関数
    function moveFallingText(timestamp) {  //ココいじった
      if (!isFalling) return;

      let elapsed = timestamp - lastTimestamp; // 前回のフレームからの経過時間
      if (elapsed >= fallStepDuration) {// 経過時間がステップ時間以上なら
        lastTimestamp = timestamp; // タイムスタンプを更新
        fallStep++;
        const percentage = (fallStep / totalFallSteps) * maxFallHeight;//パーセンテージ計算
        fallingText.style.top = `calc(${percentage}vh)`;        //落下文字の位置を設定
      }

      if (fallStep <= totalFallSteps && isFalling) {//落下ステップが最大ステップ以下かつ落下中の場合
        checkCollision();                                       //衝突確認
        const fallingRect = fallingText.getBoundingClientRect();//落下文字の矩形を取得
        const windowHeight = window.innerHeight;                //ウィンドウの高さ
        if (fallingRect.bottom >= windowHeight) {               // 落下文字が画面下端に到達したら
            jikangireShori(); // 時間切れ処理
        } else {
          requestAnimationFrame(moveFallingText); // 次のフレームを予約
        }
      }
  }

// 衝突検知関数
    function checkCollision() {
      const fallingRect = fallingText.getBoundingClientRect();// 落下文字の矩形を取得
      const risingRect = risingText.getBoundingClientRect();  // 上昇文字の矩形を取得
      if (
        fallingRect.top >= risingRect.top &&    // 落下文字の上端が上昇文字の上端より大きいか
        //fallingRect.top <= risingRect.bottom &&// 落下文字の上端が上昇文字の下端より小さいか
        fallingRect.left <= risingRect.right && // 落下文字の左端が上昇文字の右端より小さいか
        fallingRect.right >= risingRect.left    // 落下文字の右端が上昇文字の左端より大きいか
      ) {// 衝突したら
        inputTextInput.focus();                 // 入力欄にフォーカス
        checkAnswer(inputTextInput,fallingRect) // 答え合わせ
        inputTextInput.value = "";              // 入力欄をリセット
        }
    }
// 答え合わせ関数
    function checkAnswer(inputText,fallingRect) {
      let correctAnswer = quizData[currentQuestionIndex].formula;//  正解の取得
      let kaitou =inputText.value
      if(kaitou===""){                // kaitouが""の時に不正解処理をさせない
        return;
      }
      if (kaitou === correctAnswer) { // 入力値が正解の場合
        seikaiShori(fallingRect)//  正解処理
      } else {
        fuseikaiShori(fallingRect)//  不正解処理
      }
  }
// 正解したときの処理関数
    function seikaiShori(fallingRect) {
        clearInterval(timer);             // タイマー停止
        explosionSound.play();            // 爆発音再生
        score += timeLeft/yarinaosiKaisu; // 残り時間をスコアに加算
        totalScore = totalScore + timeLeft/yarinaosiKaisu;
        document.getElementById("scoreDisplay").textContent = `スコア: ${score}`;
        var roundedtotalScore = totalScore.toFixed(1);
        document.getElementById("totalScoreDisplay2").textContent = `Total Score: ${roundedtotalScore}`;; //  得点を表示
        scatterText(fallingRect);         // 散乱文字
    }
// 不正解処理関数（本当の不正解は時間切れ）
  function fuseikaiShori() {
        hazureSound.play();//ハズレ再生
    }

//　文字バラバラ関数
function scatterText(collisionRect) {
    const text = fallingText.textContent;//  落下文字を取得
    fallingText.style.display = 'none';//  落下文字を非表示
    isFalling = false;//落下中を停止
        const fragmentCount = text.length;//  フラグメント数
        const centerX = collisionRect.left + collisionRect.width / 2;//  中心X
        const centerY = collisionRect.top + collisionRect.height / 2;//  中心Y

        for (let i = 0; i < fragmentCount; i++) {
            const char = text[i];
            const span = document.createElement('span');
            span.textContent = char;
            span.className = 'fragment';
            span.style.setProperty('--x', Math.random() * 200 - 100);
            span.style.setProperty('--y', Math.random() * 200 - 100);
            span.style.left = `${centerX}px`;
            span.style.top = `${centerY}px`;
            container.appendChild(span);
        }
    //risingText.style.display = 'block';//  上昇文字を表示
    formattedAnswer.style.display = "none"; // フォーマットテキストを非表示    
    nextButton.style.display = "block";//  次のボタンを表示
}

// やりなおしボタンクリック時   
    document.getElementById("restartButton").addEventListener("click", restartGame);
// やりなおし再開関数
function restartGame() {
    if (wrongAnswers.length === 0) return;              // 間違えた問題がない場合は処理しない
    document.getElementById("wrongAnswersList").style.display = "none"; // 前回の間違いリストを非表示
    let unansweredQuestions = quizData.slice(currentQuestionIndex); // まだ出題していない問題
    unansweredQuestions = unansweredQuestions.slice(1);
    quizData = [...wrongAnswers,...unansweredQuestions];// 間違えた問題のみを出題リストとして設定
    score = 0;                  // スコアをリセット
    timeOutCount = 0;           // ライフをリセット
    yarinaosiKaisu++;           // やり直し回数カウントアップ
    currentQuestionIndex = 0;   // 最初の問題に戻す
    wrongAnswers = [];          // クリアして、新たな間違いを記録できるようにする
    gamenRest ();               // 画面をリセット   
    updateLifeDisplay();        // ライフを更新
    //updateTotalScoreDisplay();  // 得点を再表示
    loadQuestion();             // 問題読み込み
}


//合計得点表示更新関数
function updateTotalDisplay() {
  document.getElementById("totalScoreDisplay").textContent = `Total Score: ${totalScore}`;
}

//タイマー始動関数  
function startTimer() {
    timeoutMessage.style.display = "none"; // 「時間切れ」メッセージを非表示
    timeLeft = 20; // 制限時間リセット
    document.getElementById("scoreDisplay").textContent = `スコア: ${score}`;//スコアを表示
    document.getElementById("timerDisplay").textContent = `残時間: ${timeLeft}秒`; // 初期表示
    timer = setInterval(() => { // 1秒ごとに実行
        timeLeft--;             //  残り時間を減らす
        document.getElementById("timerDisplay").textContent = `残時間: ${timeLeft}秒`; // 残り時間を更新
        if (timeLeft <= 0) {    //  残り時間が0以下なら
            jikangireShori(currentQuestionIndex);  //  時間切れ処理  
        }
    }, 1000);// 1000ミリ秒（1秒）ごとに実行
}

//時間切れ処理関数
function jikangireShori(currentQuestionIndex) {
  if (isFalling) return; // 落下中の場合は処理しない
      isFalling = false; // 落下を停止
      clearInterval(timer); // タイマー停止
      timeOutCount++; // 時間切れカウントを増やす
      timeOverSound.play(); // 時間切れ音を再生
      timeoutMessage.style.display = "block"; // 「時間切れ」メッセージを表示
      timeoutMessage.textContent = "時間切れ！"; // 「時間切れ」と表示
      updateLifeDisplay(); // ライフを更新
      formattedAnswer.style.display = "none"; // フォーマットテキストを非表示
      nextButton.style.display = "block"; // 「次へ」ボタンを表示
    
      if (!wrongAnswers.some(q => q.name === quizData[currentQuestionIndex].name)) {
            wrongAnswers.push(quizData[currentQuestionIndex]);
      }
      if (timeOutCount >= 3) {// 3回時間切れなら
            endGame(); // ゲーム終了
        return;
      }
}

//文字入力時に上昇文字を更新    
inputTextInput.addEventListener('input', updateRisingText);

//上付き下付を処理    
    function updateRisingText() {//上昇文字の更新
      const input = inputTextInput.value.trim();//  入力値
      let formattedText = '';// フォーマット済みテキスト
      risingText.style.display = "block"; // 変換文字を表示
      for (let i = 0; i < input.length; i++) {//  入力文字数分繰り返し
        if (input[i] === '^' && i > 0) {//  文字が^かつインデックスが0より大きい場合
          formattedText =
            formattedText.slice(0, -1) +
            `<sup>${formattedText.slice(-1)}</sup>`;//  フォーマット済みテキストを更新
          } else if (input[i] === "_" && i > 0) {// _の前の文字を下付きに
            formattedText =
            formattedText.slice(0, -1) +
            `<sub>${formattedText.slice(-1)}</sub>`;//  フォーマット済みテキストを更新
          } else {
          formattedText += input[i];
        }
      }
      risingText.style.display = 'block';//  上昇文字を表示
      risingText.style.bottom = "45%"; // 🔴必要に応じて調整 ←ココを10にすると全画面
      formattedAnswer.innerHTML  = formattedText|| '<sup></sup>';
      risingText.innerHTML = formattedText || '<sup></sup>';
      // デバッグ用　console.log("ココを通りました： ",risingText.innerHTML); 
    }

//発射ボタンクリック時にカスタムテキスト発射    
fireButton.addEventListener('click', fireinputText)

//文字発射処理
    function fireinputText(){
        fireSound.currentTime = 0; //  音をリセット
        fireSound.play().catch(e => console.error("再生エラー:", e)); //  スマホ対応
        formattedAnswer.style.display = "none"; // フォーマットテキストを非表示
        risingText.style.display = 'block';//  上昇文字を表示
        const inputText = inputTextInput.value; // 入力値を取得
        risingAnimation = risingText.animate(//  上昇アニメーション
        [
          { transform: 'translateY(0) translateX(-50%)' },//  変換
          { transform: `translateY(${maxRiseHeight}vh) translateX(-50%)` } // 🔴 上昇範囲を -40vh に制限,－100にすれば全画面
        ],
        {
          duration: 2000,//  持続時間
          iterations: 1,//  繰り返し回数
          fill: 'none' //  終わったら元の位置に戻る
        }
      );
        risingAnimation.onfinish = () => {//  上昇アニメーション終了時
        risingText.style.display = 'none';//  上昇文字を表示
        };
    }

// ライフ表示を更新
function updateLifeDisplay() {
  const lifeDisplay = document.getElementById("lifeDisplay");
  let lives = "♥".repeat(maxLives - timeOutCount); // 残りライフを表示
  lifeDisplay.textContent = lives || "GAME OVER"; // 0なら "GAME OVER" 表示
}

// ゲーム終了時処理
function endGame() {
    timer = null;  // タイマーIDをリセット
    isFalling = false; // 落下を停止

    timeoutMessage.style.display = "none"; // 「時間切れ」メッセージを非表示
    risingText.style.display = "none";//  上昇文字を非表示
    formattedAnswer.style.display = "none"; // フォーマットテキストを非表示
    finalScore = totalScore
    var roundedtotalScore = totalScore.toFixed(1);
    document.getElementById("totalScoreDisplay3").textContent =
              `Total Score: ${roundedtotalScore}`;; //  得点を表示


    // クイズ要素を非表示
    document.getElementById("fallingText").style.display = "none";
    document.getElementById("risingText").style.display = "none";
    document.getElementById("inputContainer").style.display = "none";
    document.getElementById("nextButton").style.display = "none";
    clearInterval(timer);// タイマーを完全に停止
// 間違えた問題一覧を表示
    const wrongAnswersContainer = document.getElementById("wrongAnswersContainer");
    wrongAnswersContainer.innerHTML = ""; // 一度リセット
    if (wrongAnswers.length > 0) {    //間違えた問題が1問以上あったら
        document.getElementById("wrongAnswersList").style.display =
                           "block"; // 間違えリストを表示する
        wrongAnswers.forEach(question => {
            const li = document.createElement("li");
            li.textContent = `${question.name}`;
            wrongAnswersContainer.appendChild(li);
          });
      document.getElementById("restartButton").style.display = "block"; // やりなおしボタン表示
    } else {  //全問正解のときの処理
      document.getElementById("wrongAnswersList").style.display = "none"; // 全問正解なら非表示
      const upLevelSound = document.getElementById('upLevelSound'); // レベルアップ音
      upLevelSound.play();
      level++;
      
      if (level > 6) {
        audio.pause(); // 現在の曲を停止  
        
        let finalComment = "";

            if (totalScore >= 0 && totalScore <= 1000) {
              finalComment = "へなちょこ";
            } else if (totalScore >= 1001 && totalScore <= 1200) {
              finalComment = "修行が足りん";
            } else if (totalScore >= 1201 && totalScore <= 1300) {
              finalComment = "ちょこざいなヤツ";
            } else if (totalScore >= 1301 && totalScore <= 1500) {
              finalComment = "できる人です";
            } else if (totalScore >= 1501 && totalScore <= 2000) {
              finalComment = "とても優秀です";
            } else {
              finalComment = "範囲外の値です";
            }
                
        var roundedtotalScore = totalScore.toFixed(1);
        document.getElementById("totalScoreDisplay3").textContent = `Total Score: ${roundedtotalScore}`;; //  得点を表示
        document.getElementById("finalComment").textContent = `あなたは ${finalComment}`;
        showScreen('endScreen');
        return;
      }

      audio.pause(); // 現在の曲を停止
      const uplevelSound = new Audio("uplevel.mp3"); // 効果音のファイル名
      uplevelSound.play();
      clearInterval(timer);
      currentLevel=level;     //レベルを上げる
      levelSetumei(currentLevel);
      quizuLevel(currentLevel)
    }
}

//  次へのボタンクリック時 
    nextButton.addEventListener('click', () => {
        timeLeft = 20; // 制限時間リセット
        inputTextInput.focus();
        currentQuestionIndex++;//  現在の問題インデックスを更新
        if (currentQuestionIndex < quizData.length) {
          loadQuestion(); //次の問題をロード
        } else {
        endGame()
        }
    });

//スコア表示        
        function showScoreScreen() {
      
          document.getElementById("totalScoreDisplay3").textContent = `Total Score: ${totalScore}`;
            showScreen('scoreScreen');
        }
//ニックネーム入力
        function saveScore() {
            const nickname = document.getElementById('nickname').value;
            if (nickname.trim() === '') {
                alert('ニックネームを入力し，Total Scoreをスクショしてください！');
                return;
            }
            alert(`スコアが保存されました！\nニックネーム: ${nickname}\nスコア: ${score}`);
        }

        function endLevel() {
            if (currentLevel < maxLevel) {
                const upLevelSound = document.getElementById('upLevelSound');  
                upLevelSound.play()
                currentLevel++;
                      

                showScreen('levelScreen');
                updateLevelScreen();
            } else {
                showScreen('endScreen');
            }
        }
