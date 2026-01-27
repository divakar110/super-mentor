
"use client";

import { motion, MotionProps, HTMLMotionProps } from "framer-motion";
import React from "react";

export function FadeIn({
    children,
    delay = 0,
    className,
    ...props
}: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
} & MotionProps & React.ComponentProps<"div">) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            className={className}
            {...(props as any)}
        >
            {children}
        </motion.div>
    );
}

export function SlideIn({
    children,
    delay = 0,
    className,
    direction = "left",
    ...props
}: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
    direction?: "left" | "right" | "up" | "down";
} & MotionProps & React.ComponentProps<"div">) {
    const variants = {
        hidden: {
            x: direction === "left" ? -50 : direction === "right" ? 50 : 0,
            y: direction === "up" ? 50 : direction === "down" ? -50 : 0,
            opacity: 0,
        },
        visible: {
            x: 0,
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                delay,
                ease: "easeOut",
            },
        },
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={variants}
            className={className}
            {...(props as any)}
        >
            {children}
        </motion.div>
    );
}

export const StaggerContainer = ({
    children,
    delay = 0,
    className,
    staggerChildren = 0.1,
    ...props
}: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
    staggerChildren?: number;
} & MotionProps & React.ComponentProps<"div">) => {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                visible: {
                    transition: {
                        staggerChildren: staggerChildren,
                        delayChildren: delay,
                    },
                },
            }}
            className={className}
            {...(props as any)}
        >
            {children}
        </motion.div>
    );
};

export const StaggerItem = ({
    children,
    className,
    ...props
}: {
    children: React.ReactNode;
    className?: string;
} & MotionProps & React.ComponentProps<"div">) => {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={className}
            {...(props as any)}
        >
            {children}
        </motion.div>
    );
};
