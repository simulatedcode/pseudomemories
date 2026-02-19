import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { revalidateSecret } from "@/sanity/env";

export async function POST(req: NextRequest) {
    try {
        const { body, isValidSignature } = await parseBody<{
            _type: string;
            slug?: string | { current: string };
        }>(req, revalidateSecret);

        if (!isValidSignature) {
            return new NextResponse("Invalid signature", { status: 401 });
        }

        if (!body?._type) {
            return new NextResponse("Bad Request", { status: 400 });
        }

        // Revalidate by type
        revalidateTag(body._type, "max");

        // Optional: Revalidate by slug if provided
        const slug = typeof body.slug === "string" ? body.slug : body.slug?.current;
        if (slug) {
            revalidateTag(`${body._type}:${slug}`, "max");
        }

        return NextResponse.json({
            revalidated: true,
            now: Date.now(),
            type: body._type
        });
    } catch (err: any) {
        console.error(err);
        return new NextResponse(err.message, { status: 500 });
    }
}
