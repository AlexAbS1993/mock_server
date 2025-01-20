export function url_parser_to_array(path: string) {
    let splittedPath = path.split('/')
    if (splittedPath.length > 0 && splittedPath[0] === '') {
        splittedPath = splittedPath.slice(1)
    }
    splittedPath[splittedPath.length - 1] = splittedPath[splittedPath.length - 1].split('?')[0]
    return splittedPath
}