import {z} from "zod";
import {NextResponse} from "next/server";
import isAuthenticated from "@/app/api/utils/isAuthenticated";
import getUser from "@/app/api/utils/getUser";
import Brand from "@/database/schema/brand";
import mime from "mime-types";
import s3 from "@/utils/s3";
import {DeleteObjectCommand, PutObjectCommand} from "@aws-sdk/client-s3";

const updateBodySchema = z.object({
    _id: z.string().length(24),
    name: z.string().max(255).min(1).optional(),
    description: z.string().max(500).min(1).optional(),
    colors: z.array(z.string().length(7)).max(6).optional(),
    logo: z.string().optional()
});

export async function PUT(req: Request) {
    let body;
    try {
        body = updateBodySchema.safeParse(await req.json());
    } catch (e) {
        return NextResponse.json(
            {error: "Invalid request body"},
            {status: 400});
    }
    if (!body.success)
        return NextResponse.json(
            {error: body.error},
            {status: 400}
        );

    const {error, session} = await isAuthenticated();
    if (error) return error;
    const user = await getUser(session);
    let brand;
    try {
        brand = await Brand.findById(body.data._id);
    } catch (e) {
        return NextResponse.json(
            {error: "Brand not found"},
            {status: 404}
        );
    }

    if (!brand)
        return NextResponse.json(
            {error: "Brand not found"},
            {status: 404}
        );
    if (!brand.owner.equals(user._id))
        return NextResponse.json(
            {error: "Unauthorized"},
            {status: 403}
        );

    if (body.data.name)
        brand.name = body.data.name;
    if (body.data.description)
        brand.description = body.data.description;
    if (body.data.colors)
        brand.colors = body.data.colors;
    if (body.data.logo) {
        let logoHeader, logoData, path;
        try {
            [logoHeader, logoData] = body.data.logo.split(";");
            path = "brands/" + user._id + "/" + `${brand.name}.${mime.extension(logoHeader.split(":")[1])}`;
            await s3.send(new PutObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET!,
                Key: path,
                Body: Buffer.from(logoData.split(",")[1], "base64"),
            }));
        } catch (e) {
            return NextResponse.json(
                {error: "Failed to upload logo"},
                {status: 500}
            );
        }

        const oldLogo = brand.logo;
        brand.logo = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${path}`;
        if (brand.logo !== oldLogo)
            await s3.send(new DeleteObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET!,
                Key: oldLogo.split("com/")[1]
            }));
    }

    return NextResponse.json(await brand.save());
}