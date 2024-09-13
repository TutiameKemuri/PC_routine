document.addEventListener('DOMContentLoaded', function() {
  // タイマーの表示領域とボタン要素を取得
  const timerDisplay = document.getElementById('timer-display');
  const timerLabel = document.getElementById('timer-label');
  const controlButton = document.getElementById('control-button');
  const prevButton = document.getElementById('prev-button');
  const nextButton = document.getElementById('next-button');

  // タイマーの時間とラベルを設定
  const timeIntervals = [
    { minutes: 5, seconds: 0, label: 'トイレ' },
    { minutes: 5, seconds: 0, label: '洗顔' },
    { minutes: 20, seconds: 0, label: '朝ごはん' },
    { minutes: 10, seconds: 0, label: '着替え' },
    { minutes: 5, seconds: 0, label: '歯磨き' }
  ];

  let currentIntervalIndex = 0;  // 現在のタイマーインデックスを保持
  let countdownInterval;         // setIntervalで使用するタイマーのID
  let isPaused = true;           // タイマーが一時停止しているかどうかを管理するフラグ
  let remainingTime;             // 残り時間を管理する変数

  // 音声ファイルの定義（1階層上のmusicフォルダ内にあるファイル。そこに残り５秒前からのカウントダウン音声を入れています。）
  const pianoSound = new Audio('../PCroutine/music/Piano02-1(Short).mp3'); //いきなり喋り始めるとびっくりするのでそれを防ぐ用
  const fiveSound = new Audio('../PCroutine/music/5.wav');
  const fourSound = new Audio('../PCroutine/music/4.wav');
  const threeSound = new Audio('../PCroutine/music/3.wav');
  const twoSound = new Audio('../PCroutine/music/2.wav');
  const oneSound = new Audio('../PCroutine/music/1.wav');
  const zeroSound = new Audio('../PCroutine/music/終了.wav');
  const otsukaresama1 = new Audio('../PCroutine/music/お疲れ様でした.wav');
  const otsukaresama2 = new Audio('../PCroutine/music/タスクを全て終えま....wav');

  // タイマーを開始する関数
  function startTimer(duration) {
    let timer = duration;
    remainingTime = duration;

    // 最初にタイマーの表示を即座に更新する
    updateTimerDisplay(timer);

    // 1秒ごとに実行されるカウントダウン処理
    countdownInterval = setInterval(function () {
      if (!isPaused) { // タイマーが動作中の場合のみ進行
        if (--timer >= 0) {
          updateTimerDisplay(timer);
          // 残り時間に応じて音声を再生する
          if (timer === 6) {
            pianoSound.play();  
          } else if (timer === 5) {
            fiveSound.play();  
          } else if (timer === 4) {
            fourSound.play();  
          } else if (timer === 3) {
            threeSound.play(); 
          } else if (timer === 2) {
            twoSound.play();   
          } else if (timer === 1) {
            oneSound.play();   
          } else if (timer === 0) {
            zeroSound.play();   
          }

        } else {
          clearInterval(countdownInterval); // タイマーを停止
          currentIntervalIndex++; // 次のタイマーに移行

          // 次のタイマーが存在する場合は開始、すべて終了したらメッセージ表示
          if (currentIntervalIndex < timeIntervals.length) {
            startNextTimer(); // 次のタイマーを開始
          } else {
            timerDisplay.textContent = 'お疲れ様でした'; // 全てのタイマー終了時にメッセージ表示
            controlButton.textContent = 'スタート'; // ボタンをスタートに戻す
            isPaused = true; // タイマーを停止状態に戻す
            // ランダムにお疲れ様メッセージを再生
            const randomSound = Math.random() < 0.5 ? otsukaresama1 : otsukaresama2;
            randomSound.play();
          }
        }
        remainingTime = timer; // 残り時間を更新
      }
    }, 1000); // 1秒ごとに実行
  }

  // タイマーの表示を更新する関数
  function updateTimerDisplay(timer) {
    let minutes = parseInt(timer / 60, 10); // 残りの分数を計算
    let seconds = parseInt(timer % 60, 10); // 残りの秒数を計算

    // 分と秒を2桁に整形（例: 05:09）
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    // タイマーの表示を更新
    timerDisplay.textContent = minutes + ':' + seconds;
  }

  // 現在のタイマーラベルを更新する関数
  function updateLabel() {
    timerLabel.textContent = timeIntervals[currentIntervalIndex].label; // タイマーラベルの表示を更新
  }

  // 次のタイマーを開始する関数
  function startNextTimer() {
    updateLabel(); // タイマーラベルを更新
    const nextInterval = timeIntervals[currentIntervalIndex]; // 次のタイマー情報を取得
    const duration = nextInterval.minutes * 60 + nextInterval.seconds; // 次のタイマーの時間を秒で計算
    startTimer(duration); // 次のタイマーを開始
  }

  // 「スタート/ストップ」ボタンがクリックされたときの処理
  controlButton.addEventListener('click', function() {
    if (isPaused) { // 一時停止中であればタイマーを再開
      if (currentIntervalIndex === 0 && !countdownInterval) { // 最初のタイマーがまだ動作していない場合
        startNextTimer(); // 最初のタイマーを開始
      }
      isPaused = false; // タイマーを動作状態に設定
      controlButton.textContent = 'ストップ'; // ボタン表示を「ストップ」に変更
    } else { // タイマー動作中の場合
      isPaused = true; // タイマーを一時停止
      controlButton.textContent = 'スタート'; // ボタン表示を「スタート」に変更
    }
  });

  // 「＜」ボタンがクリックされたときの処理（前のタイマーに戻る）
  prevButton.addEventListener('click', function() {
    if (currentIntervalIndex > 0) { // 前のタイマーが存在する場合
      clearInterval(countdownInterval); // 現在のタイマーを停止
      currentIntervalIndex--; // 前のタイマーに移動
      updateLabel(); // ラベルを更新
      const prevInterval = timeIntervals[currentIntervalIndex]; // 前のタイマー情報を取得
      const duration = prevInterval.minutes * 60 + prevInterval.seconds; // 前のタイマーの時間を秒で計算
      startTimer(duration); // 前のタイマーを開始
      isPaused = false; // タイマーを動作状態に設定
      controlButton.textContent = 'ストップ'; // ボタン表示を「ストップ」に変更
    }
  });

  // 「＞」ボタンがクリックされたときの処理（次のタイマーに進む）
  nextButton.addEventListener('click', function() {
    if (currentIntervalIndex < timeIntervals.length - 1) { // 次のタイマーが存在する場合
      clearInterval(countdownInterval); // 現在のタイマーを停止
      currentIntervalIndex++; // 次のタイマーに移動
      updateLabel(); // ラベルを更新
      const nextInterval = timeIntervals[currentIntervalIndex]; // 次のタイマー情報を取得
      const duration = nextInterval.minutes * 60 + nextInterval.seconds; // 次のタイマーの時間を秒で計算
      startTimer(duration); // 次のタイマーを開始
      isPaused = false; // タイマーを動作状態に設定
      controlButton.textContent = 'ストップ'; // ボタン表示を「ストップ」に変更
    }
  });
});
