// 配列で記録を管理
let records = [];
let editIndex = -1; // 修正中のインデックス（-1は新規追加モード）

//各要素を取得
const dateInput = document.getElementById('dateInput');
const bookNameInput = document.getElementById('bookName');
const authorNameInput = document.getElementById('author');
const memoInput = document.getElementById('memo');
const addBtn = document.getElementById('addBtn');
const cancelBtn = document.getElementById('cancelBtn');
const bookList = document.getElementById('bookList');

// デバッグ用：要素取得の確認
if (!dateInput || !bookNameInput || !authorNameInput || !memoInput || !addBtn || !bookList ) {
  console.error('要素の取得に失敗しました。HTMLのIDを確認してください。');
}

// ページ読み込み時にlocalStorageから記録を復元
try {
  const savedRecords = JSON.parse(localStorage.getItem('bookRecords')) || [];
  if (Array.isArray(savedRecords)) {
    records = savedRecords;
    renderRecords();
  }
} catch (e) {
  console.error('localStorageのデータ読み込みに失敗:', e);
  records = [];
}

// 記録を追加または更新
addBtn.addEventListener('click', () => {
  const date = dateInput.value;
  const bookName = bookNameInput.value;
  const author = authorNameInput.value;
  const memo = memoInput.value.trim();

  if (!date || !bookName) {
    alert('日付と書籍名は必ず入力してください');
    return;
  }

  if (editIndex === -1) {
    // 新規追加
    records.push({ 
      date, bookName, author, memo, //書籍情報
      completed: false //読了フラグ
     });
  } else {
    // 更新
    records[editIndex] = { 
      date: dateInput.value,
      bookName: bookNameInput.value,
      author: authorNameInput.value,
      memo: memoInput.value.trim()
    };
    editIndex = -1;
    addBtn.textContent = '記録する';
    if (cancelBtn) cancelBtn.style.display = 'none';
  }

  // localStorageと画面を更新
  localStorage.setItem('bookRecords', JSON.stringify(records));
  renderRecords();

  // 入力フィールドをクリア
  dateInput.value = '';
  bookNameInput.value = '';
  authorNameInput.value = '';
  memoInput.value = '';


});

// キャンセルボタンの処理
if (cancelBtn) {
  cancelBtn.addEventListener('click', () => {
    dateInput.value = '';
    bookNameInput.value = '';
    authorNameInput.value = '';
    memoInput.value = '';
    editIndex = -1;
    addBtn.textContent = '記録する';
    cancelBtn.style.display = 'none';
  });
} else {
  console.warn('キャンセルボタンが見つかりません。HTMLにid="cancelBtn"を追加してください。');
}

// 記録を表示
function renderRecords() {
  bookList.innerHTML = '';
  let totalMinutes = 0;
  const selectedDate = dateInput.value || '';

  // 読み始めた本だけ
  const filteredRecords = records.filter(record => !record.completed);

  //日付順にソート
  filteredRecords.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  filteredRecords.forEach((record, index) => {
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
      // 全体のrecords配列からインデックスを特定
      const globalIndex = records.findIndex(r => 
        r.date === record.date && r.bookName === record.bookName && r.author === record.author && r.memo === record.memo
      );
      
      if (globalIndex !== -1) {
        dateInput.value = record.date;
        bookNameInput.value = record.bookName;
        authorNameInput.value = record.author;
        memoInput.value = record.memo;
        editIndex = globalIndex;
        addBtn.textContent = '更新';
        if (cancelBtn) cancelBtn.style.display = 'inline';
      }
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

    // 読了ボタン
    const completeBtn = document.createElement('button');
    completeBtn.textContent = '読了';
    completeBtn.className = 'complete';
    completeBtn.addEventListener('click', () => {
      const globalIndex = records.findIndex(r => 
        r.date === record.date && r.bookName === record.bookName && r.author === record.author && r.memo === record.memo
      );
      if (globalIndex !== -1) {
        records[globalIndex].completed = true;
        localStorage.setItem('bookRecords', JSON.stringify(records));
        //window.location.href = 'completed.html';
        alert('読了にしました！読了ページを確認してください\n※ページを更新してください');
      }
    });
    buttonGroup.appendChild(completeBtn);

    li.appendChild(content);
    li.appendChild(buttonGroup);
    bookList.appendChild(li);
  });


}

//未読ページから読了ページへ移動
const backBtn = document.getElementById('backBtn');

if (backBtn) {
  backBtn.addEventListener('click', () => {
    window.location.href = 'completed.html';
  });
}
