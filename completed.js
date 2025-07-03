//配列で記録を管理
let records = [];
let editIndex = -1; // 修正中のインデックス（-1は新規追加モード）

//要素取得
const dateInput = document.getElementById('dateInput');
const bookNameInput = document.getElementById('bookName');
const authorNameInput = document.getElementById('author');
const memoInput = document.getElementById('memo');
const addBtn = document.getElementById('addBtn');
const editBtn = document.getElementById('editBtn');
const cancelBtn = document.getElementById('cancelBtn');
const bookList = document.getElementById('bookList');

// デバッグ用：要素取得の確認
if (!bookList ) {
  console.error('要素の取得に失敗しました。HTMLのIDを確認してください。');
}

//localStorageからデータ取得
try {
  const savedRecords = JSON.parse(localStorage.getItem('bookRecords')) || [];
  if (Array.isArray(savedRecords)) {
    records = savedRecords;
    //renderRecords();
  }
} catch (e) {
  console.error('localStorageのデータ読み込みに失敗:', e);
  records = [];
}

addBtn.addEventListener('click', () => {
  const date = dateInput.value;
  const bookName = bookNameInput.value;
  const author = authorNameInput.value;
  const memo = memoInput.value.trim();

  if (!date || !bookName) {
    alert('日付と書籍名は必須です');
    return;
  }

  if (editIndex === -1) {
    // 新規追加
    records.push({ date, bookName, author, memo, completed: true });
  } else {
    // 更新
    records[editIndex] = { date, bookName, author, memo, completed: true };
    editIndex = -1;
    addBtn.textContent = '記録する';
    if (cancelBtn) cancelBtn.style.display = 'none';
  }

  localStorage.setItem('bookRecords', JSON.stringify(records));
  location.reload(); // このタイミングでリロードすればOK
});

//キャンセルボタンの処理
if (cancelBtn) {
  cancelBtn.addEventListener('click', () => {
    // 入力欄をクリア
    dateInput.value = '';
    bookNameInput.value = '';
    authorNameInput.value = '';
    memoInput.value = '';

    // 編集モード解除
    editIndex = -1;
    addBtn.textContent = '記録する';
    cancelBtn.style.display = 'none';
  });
}


//読了済みだけフィルタリング
const completedRecords = records.filter(record => record.completed);


//リスト表示
completedRecords.forEach(record => {
  const li = document.createElement('li');
  const content = document.createElement('span');
  const contentWrapper = document.createElement('div');
  content.className = 'record-text';//テキスト部分
  contentWrapper.className = 'record-content';//外側の枠

  // 日付と書籍名
  const title = document.createElement('p');
  title.innerHTML = `<strong>${record.date}</strong> ${record.bookName}`;
  content.appendChild(title);

  // 著者名（任意）
  if (record.author) {
    const author = document.createElement('p');
    author.textContent = `著者：${record.author}`;
    content.appendChild(author);
  }

  // メモ（任意）
  if (record.memo) {
    const memo = document.createElement('p');
    memo.className = 'memo';
    memo.textContent = `メモ：${record.memo}`;
    content.appendChild(memo);
  }

  //ボタン用のdiv
  const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

  // 修正ボタン
    const editBtn = document.createElement('button');
    editBtn.textContent = '修正';
    editBtn.className = 'edit';
    editBtn.addEventListener('click', () => {
      
      const globalIndex = records.findIndex(r =>
        r.date === record.date &&
        r.bookName === record.bookName &&
        r.author === record.author &&
        r.memo === record.memo
      );

      if (globalIndex !== -1) { 
        //更新
        dateInput.value = record.date;
        bookNameInput.value = record.bookName;
        authorNameInput.value = record.author;
        memoInput.value = record.memo;
        editIndex = globalIndex;
        addBtn.textContent = '更新する';
        if (cancelBtn) cancelBtn.style.display = 'inline';
      }
      // localStorageと表示を更新
      localStorage.setItem('bookRecords', JSON.stringify(records));
      //location.reload(); 
    });
  buttonGroup.appendChild(editBtn);
  
  // 削除ボタン
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '削除';
    deleteBtn.className = 'delete';
    deleteBtn.addEventListener('click', () => {
      const globalIndex = records.findIndex(r => 
        r.date === record.date && r.bookName === record.bookName && r.author === record.author && r.memo === record.memo
      );
      if (globalIndex !== -1) {
        records.splice(globalIndex, 1);
        localStorage.setItem('bookRecords', JSON.stringify(records));
        renderRecords();
      }
    });
    buttonGroup.appendChild(deleteBtn);

  // 未読ボタン
    const returnBtn = document.createElement('button');
    returnBtn.textContent = '未読';
    returnBtn.className = 'complete';
    returnBtn.addEventListener('click', () => {
      const globalIndex = records.findIndex(r => 
        r.date === record.date && r.bookName === record.bookName && r.author === record.author && r.memo === record.memo
      );
      if (globalIndex !== -1) {
        records[globalIndex].completed = false;
        localStorage.setItem('bookRecords', JSON.stringify(records));
        alert('未読にしました！未読ページを確認してください\n※ページを更新してください');
      }
    });
    buttonGroup.appendChild(returnBtn);  
  
  li.appendChild(content);  
  li.appendChild(buttonGroup);
  bookList.appendChild(li);
});

//読了ページから未読ページへ移動
const backBtn = document.getElementById('backBtn');

if (backBtn) {
  backBtn.addEventListener('click', () => {
    window.location.href = 'Reading Journal.html';
  });
}

