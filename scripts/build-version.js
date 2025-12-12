const fs = require('fs');
const { execSync } = require('child_process');

// 获取当前git commit hash
let gitHash = '';
try {
  gitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
} catch (error) {
  console.error('获取git hash失败:', error);
  gitHash = 'unknown';
}

// 获取当前构建日期
const buildDate = new Date().toISOString().split('T')[0];

// 创建版本信息文件
const versionInfo = {
  gitHash,
  buildDate
};

// 写入到public目录，这样客户端可以访问
fs.writeFileSync(
  'public/version.json',
  JSON.stringify(versionInfo, null, 2)
);

// 写入到.env.local文件，供Next.js环境变量使用
fs.appendFileSync(
  '.env.local',
  `\n# Build version info\nNEXT_PUBLIC_GIT_HASH=${gitHash}\nNEXT_PUBLIC_BUILD_DATE=${buildDate}\n`,
  { flag: 'a' }
);

console.log('版本信息生成成功:', versionInfo);