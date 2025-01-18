class Route {
    #path
    constructor(path){
        this.#path = path
        this.handlers = {
        }
    }
    resolve(method){
        this.#applyMiddlewares(method)
        return this.#applyHandler(method)
    }
    apply(method, handler, mwrs){
        if (!this.handlers[method]){
            this.handlers[method] = {}
        }
        this.handlers[method].handler = handler
        this.handlers[method].mwrs = mwrs
        return this
    }
    getPath(){
        return this.#path
    }
    #applyMiddlewares(method){
        this.handlers[method].mwrs.forEach(middleware => {
            try{
                middleware.execute()
            }
            catch(e){
                throw new Error(`Ошибка в ${middleware.getName()}`, {cause: e})
            }
        });
    }
    #applyHandler(method){
        try{
            this.handlers[method].handler.execute()
        }
        catch(e){

        }
    }
}

module.exports = Route