interface IComponentButton {
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

interface IComponentModalButton extends IComponentButton {
}

type ComponentUseCallbackType = ((node: HTMLElement) => {
    destroy?: () => void,
    update?: () => void
} | void) | undefined;

interface IComponentState {open: boolean};

type ComponentOrientationType = "start"|"end"|"top"|"bottom";

type ComponentPromiseFunc = (() => Promise<string>) | undefined;

type ComponentSizeType = "sm"|"md"|"lg"|"xl"|"xxl";

type ChartType = "line" | "bar" | "pie" | "doughnut";

interface IGridHeader {
    text: string; 
    width?: string; 
    minWidth?: string;
    class?: string;
    style?: string;
}

interface IDataGrid {
    initialized: boolean;
    working: boolean;
    skip: number; 
    take: number;
    count: number;
    page:  number;
    pageCount: number;
    error: any;
    setPage: (number) => Promise<void>;
    refresh: () => Promise<void>;
}

interface IValueName {
    value: any, 
    name: string
};


interface IPagedResponse<T> {
    count: number, 
    page: T[]
};

interface IMultiselectResponse extends IPagedResponse<IValueName> { };

interface IMultiselectRequest {
    search: string, 
    limit: number, 
    offset: number
}

interface IMultiselect<TItem> {
    selected: TItem[];
    getSelectedKeys: () => any[];
    toggleItem: (item: TItem) => boolean;
    containsKey: (key: any) => boolean;
}

type ReadBehaviorType = "immediate"|"onMount"|"custom";