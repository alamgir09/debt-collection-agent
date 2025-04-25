export async function POST(req: Request) {
  const { message } = await req.json();
  console.log(message);
  return new Response("Hello, world!");
}