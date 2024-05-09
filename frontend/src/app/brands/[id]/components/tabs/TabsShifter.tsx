"use client";

import React, {useContext} from "react";
import InformationTab from "@/app/brands/[id]/components/tabs/InformationTab";
import BrandDisplayContext, {
    Tabs,
    tabsDisplay
} from "@/app/brands/[id]/components/BrandDisplayContext/BrandDisplayContext";
import SettingsTab from "@/app/brands/[id]/components/tabs/SettingsTab";

function TabButton({ currentTab, order = "middle", children }: {
    currentTab: Tabs;
    order?: "left" | "middle" | "right";
    children?: React.ReactNode;
}) {
    const { tab, setTab } = useContext(BrandDisplayContext);
    const selected = tab === currentTab;

    return (
        <button
            type={"button"}
            className={
                (selected ? "bg-dark-ghost-white text-dark-ghost-black " : "text-dark-ghost-black ") +
                "px-4 py-2 " +
                (order === "left" ? "rounded-l-md " : "") +
                (order === "right" ? "rounded-r-md " : "") +
                (!selected ? "hover:underline hover:bg-dark-ghost-white transition-all" : "")
            }
            disabled={selected}
            onClick={() => setTab(currentTab)}
        >
            {children}
        </button>
    );
}

export function TabSelection() {
    const { tab } = useContext(BrandDisplayContext);

    if (tab === Tabs.Information)
        return <InformationTab />
    if (tab === Tabs.Settings)
        return <SettingsTab />
    return <></>
}

export default function TabsShifter() {
    return (
        <div className={"w-full rounded-md bg-ghost-white mb-8 shadow-md"}>
            {tabsDisplay.map((tab, index) => (
                <TabButton
                    key={index}
                    currentTab={tab.id}
                    order={(index === 0 ? "left" : (index === tabsDisplay.length - 1 ? "right" : "middle"))}
                >
                    {tab.text}
                </TabButton>
            ))}
        </div>
    );
}
