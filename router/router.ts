import { Handler } from "./handlers/types"
import { METHODS } from "./helpers/methods"
import { url_parser_to_array } from "./helpers/url_parser"
import { Route } from "./routes"

export class Router {
    public routes_dictionary: { [key: string]: any } = {}
    private working_directory: null | { route: Route, [key: string]: any } = null
    defineRouteFor(path: string) {
        const route = new Route(path)
        const parsedPath = this.path_parser(path)
        const directory = this.resolveDictionaryNote(parsedPath)
        directory.route = route
        this.setWorkingDirectory(directory as { route: Route, [key: string]: any })
        return this
    }
    get(handler: Handler<unknown, unknown>) {
        this.working_directory!.route.apply(METHODS.GET, handler)
        return this
    }
    post(handler: Handler<unknown, unknown>) {
        this.working_directory!.route.apply(METHODS.POST, handler)
        return this
    }
    delete(handler: Handler<unknown, unknown>) {
        this.working_directory!.route.apply(METHODS.DELETE, handler)
        return this
    }
    put(handler: Handler<unknown, unknown>) {
        this.working_directory!.route.apply(METHODS.PUT, handler)
        return this
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
}