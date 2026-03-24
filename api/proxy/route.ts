export const runtime = 'edge';

export async function GET(request: Request) {
  return handle(request);
}

export async function POST(request: Request) {
  return handle(request);
}

async function handle(request: Request) {
  const url = new URL(request.url);

  // 从环境变量读取目标（多个用逗号分隔）
  const targets = (process.env.TARGET_HOSTS || "").split(",");

  if (!targets.length) {
    return new Response("No target configured", { status: 500 });
  }

  const target = targets[Math.floor(Math.random() * targets.length)];

  // 拼接目标 URL
  const targetUrl = new URL(url.pathname + url.search, `https://${target}`);

  // 转发请求
  const newRequest = new Request(targetUrl.toString(), {
    method: request.method,
    headers: request.headers,
    body: request.body,
  });

  return fetch(newRequest);
}
