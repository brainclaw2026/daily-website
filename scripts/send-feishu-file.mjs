#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const [, , filePath, to, receiveIdType = 'open_id'] = process.argv;
if (!filePath || !to) {
  console.error('Usage: node send-feishu-file.mjs <file_path> <to> <receive_id_type>');
  process.exit(1);
}

const cfg = JSON.parse(fs.readFileSync(path.join(process.env.HOME, '.openclaw', 'openclaw.json'), 'utf8'));
const feishuCfg = cfg?.channels?.feishu ?? {};
const defaultAccountId = feishuCfg?.defaultAccount || 'default';
const defaultAccount = feishuCfg?.accounts?.[defaultAccountId] ?? feishuCfg?.accounts?.default ?? null;
const appId = process.env.FEISHU_APP_ID || feishuCfg?.appId || defaultAccount?.appId;
const appSecret = process.env.FEISHU_APP_SECRET || feishuCfg?.appSecret || defaultAccount?.appSecret;
if (!appId || !appSecret) {
  console.error('Missing Feishu app credentials in ~/.openclaw/openclaw.json (top-level or channels.feishu.accounts.<id>)');
  process.exit(1);
}

const ext = path.extname(filePath).toLowerCase();
const fileType = ext === '.pdf' ? 'pdf' : ext === '.doc' || ext === '.docx' ? 'doc' : ext === '.xls' || ext === '.xlsx' ? 'xls' : ext === '.ppt' || ext === '.pptx' ? 'ppt' : 'stream';

async function main() {
  const tokenResp = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ app_id: appId, app_secret: appSecret })
  });
  const tokenJson = await tokenResp.json();
  if (!tokenResp.ok || tokenJson.code !== 0) throw new Error(`token failed: ${JSON.stringify(tokenJson)}`);
  const token = tokenJson.tenant_access_token;

  const form = new FormData();
  form.append('file_type', fileType);
  form.append('file_name', path.basename(filePath));
  form.append('file', new Blob([fs.readFileSync(filePath)]), path.basename(filePath));

  const uploadResp = await fetch('https://open.feishu.cn/open-apis/im/v1/files', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form
  });
  const uploadJson = await uploadResp.json();
  if (!uploadResp.ok || uploadJson.code !== 0) throw new Error(`upload failed: ${JSON.stringify(uploadJson)}`);
  const fileKey = uploadJson.data.file_key;

  const msgResp = await fetch(`https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=${encodeURIComponent(receiveIdType)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ receive_id: to, msg_type: 'file', content: JSON.stringify({ file_key: fileKey }) })
  });
  const msgJson = await msgResp.json();
  if (!msgResp.ok || msgJson.code !== 0) throw new Error(`send failed: ${JSON.stringify(msgJson)}`);
  console.log(JSON.stringify(msgJson));
}

main().catch(err => {
  console.error(err.stack || String(err));
  process.exit(1);
});
