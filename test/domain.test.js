import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parseDomain } from '../src/domain.js';

const raw = await readFile(new URL('../fixtures/domain.json', import.meta.url), 'utf8');

test('样例领域资料完整', () => {
  const value = parseDomain(raw);
  assert.equal(value.domain, 'expo-experience');
  assert.ok(value.entities.length >= 3);
  assert.ok(value.rules.length >= 3);
});

test('接续服务的八类编号对象都在实体清单中', () => {
  const value = parseDomain(raw);
  const numbered = ['展位', '产品型号', '演示固件', '样机状态', '讲解人员', '体验时段', '现场订单', '售后承诺'];
  for (const name of numbered) {
    assert.ok(value.entities.includes(name), `实体清单缺少：${name}`);
  }
  assert.equal(new Set(value.entities).size, value.entities.length, '实体清单存在重复条目');
});

test('规则覆盖接续服务的关键承诺', () => {
  const value = parseDomain(raw);
  const rules = value.rules.join('\n');
  assert.match(rules, /分别编号/, '缺少分别编号规则');
  assert.match(rules, /科普展品不得进入销售流程/, '缺少科普展品隔离规则');
  assert.match(rules, /明确同意/, '缺少明确同意规则');
  assert.match(rules, /按期删除/, '缺少按期删除规则');
  assert.match(rules, /确定结果/, '缺少确定结果规则');
  assert.match(rules, /离场后核对/, '缺少离场核对规则');
  assert.match(rules, /按阶段分别计算/, '缺少分阶段指标规则');
});

test('样例用编号串起体验与成交', () => {
  const value = parseDomain(raw);
  const refs = ['booth_id', 'product_model_id', 'product_version_id', 'demo_firmware_id', 'demo_unit_status_id', 'staff_id', 'slot_id', 'experience_id', 'order_id', 'after_sales_id'];
  for (const key of refs) {
    assert.ok(typeof value.sample[key] === 'string' && value.sample[key].length > 0, `样例缺少编号字段：${key}`);
  }
  assert.ok(['到场', '试用', '有效咨询', '真实成交'].includes(value.sample.metrics_stage), '样例指标阶段无效');
});
