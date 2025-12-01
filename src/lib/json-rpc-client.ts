
export class JsonRpcClient {
    private ws: WebSocket;
    private onmessage: (message: MessageEvent) => void;
    private onopen: () => void;
    private onclose: () => void;
    private onerror: (error: Event) => void;
    private callbacks: { [id: string]: { success: (result: any) => void; error: (error: any) => void; } } = {};
    private messageId = 0;

    constructor(socketUrl: string, handlers: {
        onmessage: (message: MessageEvent) => void;
        onopen: () => void;
        onclose: () => void;
        onerror: (error: Event) => void;
    }) {
        this.ws = new WebSocket(socketUrl);
        this.onmessage = handlers.onmessage;
        this.onopen = handlers.onopen;
        this.onclose = handlers.onclose;
        this.onerror = handlers.onerror;

        this.ws.onopen = this.onopen.bind(this);
        this.ws.onclose = this.onclose.bind(this);
        this.ws.onerror = this.onerror.bind(this);
        this.ws.onmessage = (message) => {
            const obj = JSON.parse(message.data);
            if (obj.id) {
                const callback = this.callbacks[obj.id];
                if (callback) {
                    if (obj.result) {
                        callback.success(obj.result);
                    } else if (obj.error) {
                        callback.error(obj.error);
                    }
                    delete this.callbacks[obj.id];
                }
            } else {
                this.onmessage(message);
            }
        };
    }

    public call(method: string, params: any, success: (result: any) => void, error: (error: any) => void) {
        const id = this.messageId++;
        this.callbacks[id] = { success, error };
        this.ws.send(JSON.stringify({ jsonrpc: '2.0', method, params, id }));
    }

    public close() {
        this.ws.close();
    }
}
