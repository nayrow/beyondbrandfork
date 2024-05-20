import React, {useContext, useEffect, useRef} from "react";
import clsx from "clsx";
import EditorContext from "@/app/brands/[id]/instagram/[postId]/components/EditorContext";
import useToolEvents from "@/app/brands/[id]/instagram/[postId]/components/useToolEvents";
import {panel} from "@/app/brands/[id]/instagram/[postId]/components/primitives";
import {IInstagramPost} from "@/database/schema/instagramPost";

export function renderContextPostShapes(
    ctx: CanvasRenderingContext2D,
    post: IInstagramPost,
) {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (const shape of post.shapes) {
        switch (shape.shape) {
            case "rectangle":
                ctx.fillStyle = shape.data.color;
                ctx.fillRect(
                    shape.data.x,
                    shape.data.y,
                    shape.data.width!,
                    shape.data.height!
                );
                break;
            case "circle":
                ctx.fillStyle = shape.data.color;
                ctx.beginPath();
                ctx.arc(
                    shape.data.x,
                    shape.data.y,
                    shape.data.radius!,
                    0,
                    2 * Math.PI
                );
                ctx.fill();
                break;
        }
    }
}

export default function Canvas() {
    const CANVAS_PADDING = 40;
    const { post} = useContext(EditorContext);
    const container = useRef<HTMLDivElement>(null);
    const canvas = useRef<HTMLCanvasElement>(null);

    useToolEvents(canvas);
    useEffect(() => {
        if (!canvas.current || !container.current)
            return;

        const { width, height } = container.current.getBoundingClientRect();
        canvas.current.width = canvas.current.height = Math.min(width, height) - CANVAS_PADDING * 2;
        container.current.addEventListener("resize", () => {
            if (!canvas.current || !container.current)
                return;
            const { width, height } =
                container.current.getBoundingClientRect();
            canvas.current.width = canvas.current.height = Math.min(width, height);
        });
    }, []);

    useEffect(() => {
        if (!canvas.current || !container.current)
            return;

        const ctx = canvas.current.getContext("2d");
        if (!ctx)
            return;

        renderContextPostShapes(ctx, post);
    }, [post]);

    return (
        <section
            ref={container}
            className={clsx(panel({ layouts: "canvas" }))}
        >
            <canvas
                ref={canvas}
                className={"border-2 border-cyan"}
            />
        </section>
    );
}