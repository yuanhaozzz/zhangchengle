const STORAGE_KEY = "reservation_data";

function getList() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveList(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function getRecords() {
  return getList();
}

export function addRecord(record) {
  const item = {
    id: Date.now(),
    ...record,
    createdAt: new Date().toISOString(),
  };

  const list = getList();
  list.unshift(item); // 最新的在前面

  // 尝试保存，空间不足时删除最旧的（数组末尾）
  while (true) {
    try {
      saveList(list);
      return item;
    } catch (e) {
      if (e.name === "QuotaExceededError" || e.code === 22 || e.code === 1014) {
        if (list.length > 1) {
          list.pop(); // 删除最旧的
        } else {
          // 只剩一条也存不下，清空再试一次
          try {
            localStorage.removeItem(STORAGE_KEY);
            saveList([item]);
            return item;
          } catch {
            throw new Error("本地存储空间严重不足，无法保存数据");
          }
        }
      } else {
        throw e;
      }
    }
  }
}

export function clearRecords() {
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}
