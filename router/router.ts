import { url_parser_to_array } from "./helpers/url_parser"
import Route from "./routes"

export class Router {
    public routes_dictionary: { [key: string]: any } = {}
    private working_directory: null | { route: Route, [key: string]: any } = null
    defineRouteFor(path: string) {
        this.injectRouteToDictionary(path)
        return this
    }
    defined() {
        this.unsetWorkingDirectory()
        return this
    }
    get(handler: any) {
        this.working_directory!.route.apply('GET', handler)
        return this
    }
    post(handler: any) {
        this.working_directory!.route.apply('POST', handler)
        return this
    }
    delete(handler: any) {
        this.working_directory!.route.apply('DELETE', handler)
        return this
    }
    put(handler: any) {
        this.working_directory!.route.apply('PUT', handler)
        return this
    }
    private setWorkingDirectory(obj: { route: Route, [key: string]: any }) {
        this.working_directory = obj
        return this
    }
    private unsetWorkingDirectory() {
        this.working_directory = null
    }
    private injectRouteToDictionary(path: string) {
        const route = new Route(path)
        const parsedPath = this.path_parser(path)
        const directory = this.resolveDictionaryNote(parsedPath)
        directory.route = route
        this.setWorkingDirectory(directory as { route: Route, [key: string]: any })
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