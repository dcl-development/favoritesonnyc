import { getHours } from "@/lib/cms";
import { toGbpHours } from "@/lib/gbp";
import { nyNow } from "@/lib/hours";

// Dry run: shows what would be sent to Google Business Profile. Sends nothing.
// The hours are already public on the site, so this exposes nothing new.
export async function GET() {
  const patch = toGbpHours(await getHours(), nyNow().date);
  return Response.json(patch, { headers: { "X-Robots-Tag": "noindex" } });
}
