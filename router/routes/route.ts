import { Handler } from '../handlers/types';
import { METHODS } from './../helpers/methods';

type handlersType = {
    [key in METHODS]?: any
}

export class Route {
    #path: string
    public handlers: handlersType
    constructor(path: string) {
        this.#path = path
        this.handlers = {
        }
    }

    resolve<dataType>(method: METHODS, data?: dataType) {
        // this.#applyMiddlewares(method, data)
        return this.#applyHandler(method, data)
    }
    apply(method: METHODS, handler: Handler<unknown, unknown>, mwrs?: any) {
        if (!this.handlers[method]) {
            this.handlers[method] = {}
        }
        this.handlers[method].handler = handler
        this.handlers[method].mwrs = mwrs
        return this
    }
    getPath() {
        return this.#path
    }
    // #applyMiddlewares<dataType>(method: METHODS, data: dataType) {
    //     this.handlers[method].mwrs.forEach((middleware: any) => {
    //         try {
    //             middleware.execute()
    //         }
    //         catch (e) {
    //             throw new Error(`Ошибка в ${middleware.getName()}`, { cause: e })
    //         }
    //     });
    // }
    #applyHandler<dataType>(method: METHODS, data: dataType) {
        try {
            return this.handlers[method].handler.execute(data)
        }
        catch (e) {
            throw new Error('Ошибка обработчика в методе ' + method + ' по пути ' + this.#path, { cause: e })
        }
    }
}