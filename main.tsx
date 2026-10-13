import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { createRoot } from "react-dom/client";
import { HoverButton } from "@/components/ui/hover-glow-button";
import { WavyBackground } from "@/components/ui/wavy-background";
import "./index.css";
import "./styles.css";
import "./script.js";

interface NavigationItem {
  route: string;
  label: string;
  icon: string;
  count?: string;
}

const navigationItems: NavigationItem[] = [
  { route: "home", label: "Home", icon: "⌂" },
  { route: "learn", label: "Learn", icon: "▤", count: "18" },
  { route: "videos", label: "Recordings", icon: "▷" },
  { route: "saved", label: "Saved", icon: "▣" },
  { route: "sessions", label: "Live sessions", icon: "◷" },
  { route: "perks", label: "Member perks", icon: "◇" },
] as const;

function routeFromHash() {
  const route = window.location.hash.replace(/^#\/?/, "").split("?")[0] || "home";
  return route === "lesson" || route === "category" ? "learn" : route === "upgrade" ? "home" : route;
}

function SidebarNavigation() {
  const [activeRoute, setActiveRoute] = useState(routeFromHash);

  useEffect(() => {
    const updateRoute = () => setActiveRoute(routeFromHash());
    window.addEventListener("hashchange", updateRoute);
    return () => window.removeEventListener("hashchange", updateRoute);
  }, []);

  return (
    <>
      {navigationItems.map(({ route, label, icon, count }) => {
        const isActive = route === activeRoute;
        return (
          <HoverButton
            key={route}
            aria-current={isActive ? "page" : undefined}
            data-route={route}
            className={`!flex !h-[39px] !w-full !items-center !gap-3 !rounded-[7px] !px-[10px] !py-0 !text-left !text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${isActive ? "font-medium" : ""}`}
            backgroundColor={isActive ? "#192335" : "transparent"}
            hoverBackgroundColor={isActive ? "#192335" : "rgba(255,255,255,.04)"}
            textColor={isActive ? "#e6ecfb" : "#9ca1a8"}
            hoverTextColor={isActive ? "#e6ecfb" : "#67e8f9"}
            glowColor="#00ffc3"
            onClick={() => {
              window.location.hash = `/${route}`;
              document.querySelector("#sidebar")?.classList.remove("open");
            }}
          >
            <span className={`nav-icon ${isActive ? "active" : ""}`} aria-hidden="true">{icon}</span>
            <span>{label}</span>
            {count && <span className="nav-count">{count}</span>}
          </HoverButton>
        );
      })}
    </>
  );
}

const navigationRoot = document.querySelector("#side-nav-root");
if (!navigationRoot) throw new Error("Sidebar navigation mount point is missing.");
const backgroundRoot = document.querySelector("#ambient-background-root");
if (!backgroundRoot) throw new Error("Ambient background mount point is missing.");

createRoot(navigationRoot).render(
  <>
    <SidebarNavigation />
    {createPortal(
      <WavyBackground
        aria-hidden="true"
        backgroundFill="var(--bg)"
        blur={14}
        colors={["var(--blue)", "var(--blue-soft)", "var(--green)"]}
        containerClassName="!h-screen"
        speed="slow"
        waveOpacity={0.5}
        waveWidth={36}
      />,
      backgroundRoot
    )}
  </>
);
