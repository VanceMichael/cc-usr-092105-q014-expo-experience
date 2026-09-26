import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parseDomain } from '../src/domain.js';

async function loadDomain() {
  const raw = await readFile(new URL('../fixtures/domain.json', import.meta.url), 'utf8');
  return parseDomain(raw);
}

test('样例领域资料完整', async () => {
  const value = await loadDomain();
  assert.equal(value.domain, 'expo-experience');
  assert.ok(value.entities.length >= 3);
  assert.ok(value.rules.length >= 3);
});

test('编号对象齐全', async () => {
  const value = await loadDomain();
  const expected = ['展位', '产品型号', '演示固件', '演示样机', '讲解人员', '体验时段', '体验记录', '数据同意', '现场订单', '售后承诺'];
  for (const entity of expected) {
    assert.ok(value.entities.includes(entity), `缺少对象：${entity}`);
  }
});

test('关键规则齐备', async () => {
  const value = await loadDomain();
  const rules = value.rules.join('\n');
  for (const keyword of ['科普', '同意', '删除', '分别', '编号', '确定结果']) {
    assert.ok(rules.includes(keyword), `规则缺少要点：${keyword}`);
  }
});

test('样例串起体验到成交的编号链', async () => {
  const value = await loadDomain();
  const keys = ['record_id', 'booth_id', 'model_id', 'firmware_id', 'unit_id', 'unit_status', 'staff_id', 'slot_id', 'consent_id', 'order_id', 'after_sales_id', 'stage'];
  for (const key of keys) {
    assert.ok(value.sample[key], `样例缺少字段：${key}`);
  }
});
