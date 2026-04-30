import { readdirSync } from 'fs';
import { join } from 'path';

export async function GET() {
  const dir = join(process.cwd(), 'public', 'images');
  const files = readdirSync(dir)
    .filter(f => /\.(jpe?g|png|webp|gif)$/i.test(f))
    .sort();
  return Response.json({ images: files });
}
