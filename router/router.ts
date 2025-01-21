import { Handler } from "./handlers/types"
import { METHODS } from "./helpers/methods"
import { url_parser_to_array } from "./helpers/url_parser"
import { Route } from "./routes"

export class Router {
    public routes_dictionary: { [key: string]: any } = {}
    private working_directory: null | { route: Route, [key: string]: any } = null
    private working_path: null | string = null
    private existing_routers: { [key: string]: string[] } = {}
    defineRouteFor(path: string) {
        const route = new Route(path)
        const parsedPath = this.path_parser(path)
        this.setCurrentPath(path).createExistingRouteOnAvailableDictionary()
        const directory = this.resolveDictionaryNote(parsedPath)
        directory.route = route
        this.setWorkingDirectory(directory as { route: Route, [key: string]: any })
        return this
    }
    get(handler: Handler<unknown, unknown>) {
        this.working_directory!.route.apply(METHODS.GET, handler)
        this.defineAvailableMethod(METHODS.GET)
        return this
    }
    post(handler: Handler<unknown, unknown>) {
        this.working_directory!.route.apply(METHODS.POST, handler)
        this.defineAvailableMethod(METHODS.POST)
        return this
    }
    delete(handler: Handler<unknown, unknown>) {
        this.working_directory!.route.apply(METHODS.DELETE, handler)
        this.defineAvailableMethod(METHODS.DELETE)
        return this
    }
    put(handler: Handler<unknown, unknown>) {
        this.working_directory!.route.apply(METHODS.PUT, handler)
        this.defineAvailableMethod(METHODS.PUT)
        return this
    }

    async deligateHandle<dataType>(path: string, method: METHODS, data?: dataType) {
        if (this.isPathExists(path, method)) {
            let parsedUrl = this.path_parser(path)
            const directory = this.resolveDictionaryNote(parsedUrl)
            this.setWorkingDirectory(directory as { route: Route, [key: string]: any })
            return await this.working_directory!.route.resolve(method, data)
        }
        throw new Error(`Путь ${path} с методом ${method} не существует`)
    }
    private setWorkingDirectory(obj: { route: Route, [key: string]: any }) {
        this.working_directory = obj
        return this
    }
    private path_parser(path: string) {
        return url_parser_to_array(path)
    }
    private resolveDictionaryNote(parsedPath: string[]) {
        let currentPath = this.routes_dictionary
        for (let i = 0; i < parsedPath.length; i++) {
            currentPath = this.checkDictionaryNoteForCreate(currentPath, parsedPath[i])
        }
        return currentPath
    }
    private checkDictionaryNoteForCreate(current: { [key: string]: Object }, next: string) {
        if (!current[next]) {
            current[next] = {}
            return current[next]
        }
        return current[next]
    }
    private createExistingRouteOnAvailableDictionary() {
        this.existing_routers[this.working_path as string] = []
        return this
    }
    private setCurrentPath(path: string) {
        this.working_path = path
        return this
    }
    private defineAvailableMethod(method: METHODS) {
        this.existing_routers[this.working_path as string].push(method)
        return this
    }
    private isPathExists(path: string, method: METHODS): boolean {
        return this.existing_routers[path] !== undefined && this.existing_routers[path].includes(method)
    }
}