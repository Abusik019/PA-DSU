import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const ScreenWidthContext = createContext(undefined);

function getWidth() {
    if (typeof window === "undefined") return 0;
    return Math.round(window.visualViewport?.width ?? window.innerWidth);
}

export function ScreenWidthProvider({
    children,
    debounceMs = 100,
    initialWidth,
}) {
    const isBrowser = typeof window !== "undefined";

    const [width, setWidth] = useState(() =>
        isBrowser ? getWidth() : initialWidth ?? 0
    );

    const rafRef = useRef(null);
    const lastCallRef = useRef(0);
    const pendingRef = useRef(false);

    const update = () => {
        const next = getWidth();
        setWidth((prev) => (prev === next ? prev : next));
    };

    const schedule = () => {
        if (!isBrowser) return;
        const now = performance.now();
        const elapsed = now - lastCallRef.current;

        if (elapsed >= debounceMs && !pendingRef.current) {
            pendingRef.current = true;
            lastCallRef.current = now;
            rafRef.current = requestAnimationFrame(() => {
                pendingRef.current = false;
                update();
                rafRef.current = null;
            });
        } else if (rafRef.current == null) {
            rafRef.current = requestAnimationFrame(() => {
                pendingRef.current = false;
                lastCallRef.current = performance.now();
                update();
                rafRef.current = null;
            });
        }
    };

    useEffect(() => {
        if (!isBrowser) return;

        update();

        const vv = window.visualViewport;

        if (vv) {
            vv.addEventListener("resize", schedule);
            vv.addEventListener("scroll", schedule);
        } else {
            window.addEventListener("resize", schedule);
            window.addEventListener("orientationchange", schedule);
        }

        return () => {
            if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
            if (vv) {
                vv.removeEventListener("resize", schedule);
                vv.removeEventListener("scroll", schedule);
            } else {
                window.removeEventListener("resize", schedule);
                window.removeEventListener("orientationchange", schedule);
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isBrowser, debounceMs]);

    return (
        <ScreenWidthContext.Provider value={width}>
            {children}
        </ScreenWidthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useScreenWidth() {
    const value = useContext(ScreenWidthContext);
    if (value === undefined) {
        throw new Error(
            "useScreenWidth must be used within <ScreenWidthProvider>"
        );
    }
    return value;
}
