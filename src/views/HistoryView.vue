<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'
import { getRecords, clearRecords } from '@/utils/storage.js'

const router = useRouter()

const records = computed(() => getRecords())

function maskIdCard(id) {
  if (!id) return ''
  if (id.length <= 4) return id
  return '*'.repeat(id.length - 4) + id.slice(-4)
}

function formatTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  return `${mm}-${dd} ${hh}:${mi}`
}

function onClear() {
  showConfirmDialog({
    title: '确认清空',
    message: '清空后无法恢复，是否继续？',
    confirmButtonColor: '#b71c1c',
  })
    .then(() => {
      clearRecords()
      showToast('已清空')
    })
    .catch(() => {})
}

function goBack() {
  router.push('/')
}
</script>

<template>
  <div class="history-page">
    <div class="history-header">
      <div class="header-left" @click="goBack">
        <van-icon name="arrow-left" />
      </div>
      <div class="history-title">预约历史</div>
      <div class="header-right" @click="onClear">清空</div>
    </div>

    <div class="history-body">
      <div v-if="records.length === 0" class="empty-state">
        <van-icon name="records-o" class="empty-icon" />
        <div class="empty-text">暂无预约记录</div>
        <van-button
          round
          plain
          color="#b71c1c"
          size="small"
          class="empty-btn"
          @click="goBack"
        >
          去预约
        </van-button>
      </div>

      <div v-else class="record-list">
        <div
          v-for="item in records"
          :key="item.id"
          class="record-card"
        >
          <div class="record-tag">
            <span class="tag-text">{{ item.package }}套装</span>
          </div>
          <div class="record-main">
            <div class="record-name">{{ item.name }}</div>
            <div class="record-id">{{ maskIdCard(item.idCard) }}</div>
          </div>
          <div class="record-time">{{ formatTime(item.createdAt) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.history-page {
  min-height: 100vh;
  background: #f5f6fa;
}

.history-header {
  background: linear-gradient(180deg, #b71c1c 0%, #c62828 100%);
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  position: relative;
}

.header-left {
  width: 40px;
  font-size: 20px;
  cursor: pointer;
}

.history-title {
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 2px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.header-right {
  width: 40px;
  text-align: right;
  font-size: 13px;
  opacity: 0.9;
  cursor: pointer;
}

.history-body {
  padding: 16px;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 80px;
}

.empty-icon {
  font-size: 64px;
  color: #ddd;
  margin-bottom: 12px;
}

.empty-text {
  font-size: 14px;
  color: #999;
  margin-bottom: 20px;
}

.empty-btn {
  width: 100px;
}

/* 列表 */
.record-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.record-card {
  background: #fff;
  border-radius: 10px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
}

.record-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #b71c1c;
}

.record-tag {
  flex-shrink: 0;
}

.tag-text {
  display: inline-block;
  padding: 6px 10px;
  background: #fdeaea;
  color: #b71c1c;
  font-size: 13px;
  font-weight: 600;
  border-radius: 4px;
}

.record-main {
  flex: 1;
  min-width: 0;
}

.record-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.record-id {
  font-size: 13px;
  color: #999;
  font-family: 'Courier New', Courier, monospace;
}

.record-time {
  flex-shrink: 0;
  font-size: 12px;
  color: #bbb;
}
</style>
