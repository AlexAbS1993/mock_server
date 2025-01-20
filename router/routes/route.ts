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

    resolve(method: METHODS) {
        this.#applyMiddlewares(method)
        return this.#applyHandler(method)
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
    #applyMiddlewares(method: METHODS) {
        this.handlers[method].mwrs.forEach((middleware: any) => {
            try {
                middleware.execute()
            }
            catch (e) {
                throw new Error(`Ошибка в ${middleware.getName()}`, { cause: e })
            }
        });
    }
    #applyHandler(method: METHODS) {
        try {
            this.handlers[method].handler.execute()
        }
        catch (e) {
            throw new Error('Ошибка обработчика в методе ' + method + ' по пути ' + this.#path, { cause: e })
        }
    }
}