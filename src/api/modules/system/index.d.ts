export declare const getMenuApi: () => {
    code: number;
    data: {
        path: string;
        name: string;
        redirect: string;
        meta: {
            icon: string;
            title: string;
            isLink: string;
            isHide: boolean;
            isFull: boolean;
            isAffix: boolean;
            isKeepAlive: boolean;
        };
        children: {
            path: string;
            name: string;
            component: string;
            meta: {
                icon: string;
                title: string;
                isLink: string;
                isHide: boolean;
                isFull: boolean;
                isAffix: boolean;
                isKeepAlive: boolean;
            };
        }[];
    }[];
    msg: string;
};
export declare const getMenuApiMock: () => Promise<import("axios").AxiosResponse<any, any, {}>>;
export declare const getUserListApi: () => Promise<unknown>;
