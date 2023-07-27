type ScreenOrientationType = "start" | "end" | "top" | "bottom";
type PromiseString = (() => Promise<string>) | undefined;
type SizeType = "sm" | "md" | "lg" | "xl" | "xxl";

type TabType = "tabs" | "pills";
type VerticalAlignType = "center" | "end" | "start";
type EmptySpaceType = "normal" | "justified" | "fill";
type LifeCycleType = "immediate" | "onMount" | "custom";
type UseCallbackType =
    | ((node: HTMLElement) => { destroy?: () => void; update?: () => void } | void)
    | undefined;
type ColorThemeType =
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark"
    | "none";
type ThemesType = "light" | "dark";

interface IFileSelector {
    file: File | undefined;
    getInput(): HTMLInputElement;
    open(): void;
}

interface IUser {
    isSigned: boolean;
    id: string;
    name: string;
    email: string;
}

interface IValueName {
    value: any;
    name: string;
}

interface IMultiSelectChangeEvent {
    /**
     * Selected keys
     */
    keys: string[];
    /**
     * Selected items
     */
    values: TItem[];
}

interface IButton {
    /**
     * Button text
     *
     * @default undefined
     */
    text: string;
    /**
     * Button click handler
     *
     * @default undefined
     */
    click: () => void;
    /**
     * Extra classes. If not defined, default class is btn-primary
     *
     * @default undefined
     */
    classes?: string;
}
type IModalButton = IButton;

interface IDataTableHeader {
    text: string;
    width?: string;
    minWidth?: string;
    class?: string;
    style?: string;
}
interface IDataTable {
    initialized: boolean;
    working: boolean;
    skip: number;
    take: number;
    count: number;
    page: number;
    pageCount: number;
    error: any;
    setPage: (number) => Promise<void>;
    refresh: () => Promise<void>;
}

interface IMultiselect<TItem> {
    getSelectedItems: () => TItem[];
    getSelectedKeys: () => string[];
    toggleItem: (item: TItem) => boolean;
    containsKey: (key: string) => boolean;
}
interface IToken {
    id: number;
    name: string;
}

type ChartType = "line" | "bar" | "pie" | "doughnut";
type ChartStateInternal = { data: any; options: any };

interface IChartData {
    labels: string[];
    series: { data: number[]; label: string | undefined }[];
}

interface IChart {
    /**
     * Chart is loading data from dataFunc
     */
    loading: boolean;
    /**
     * Function that returns internal chart state data from chart instance.
     */
    getChartState: () => ChartStateInternal;
    /**
     * Refresh chart function with new data from dataFunc.
     */
    refreshChart: () => Promise<void>;
    /**
     * Recrate and redraw chart function without fetching any data.
     */
    recreateChart: () => Promise<void>;
}
