import { Route } from "../router/routes"
import { Router } from "../router/router"
import { url_parser_to_array } from "../router/helpers/url_parser"
import { METHODS } from "../router/helpers/methods"

describe('Router принимает в себя роуты с обработчиками и выдаёт список роутов, проходя по списку зарегистрированных', () => {
    let router = new Router()
    const mock_path = '/test/feature'
    beforeEach(() => {
        router = new Router()
    })
    test('url_parser работает корректно', () => {
        let parsedPath = url_parser_to_array(mock_path)
        expect(parsedPath[0]).toBe('test')
        expect(parsedPath[1]).toBe('feature')
        let anotherParsedPath = url_parser_to_array('/hello/with/options?hey=10')
        expect(anotherParsedPath[2]).toBe('options')
    })
    describe('Router может сохранять в себе объекты роутов', () => {
        test('Когда роутер определяет роут, то в его route_dictionary появляется путь к роуту', () => {
            router.defineRouteFor(mock_path)
            expect(router.routes_dictionary.test).toBeDefined()
            expect(router.routes_dictionary.test.feature).toBeDefined()
            expect(router.routes_dictionary.test.feature.route instanceof Route).toBe(true)
        })
        test('Router после определения роута может добавлять на него обработчики методов и вызвать их', async () => {
            router
                .defineRouteFor(mock_path)
                .get({ execute() { return 1 } })
                .put({ execute() { } })
                .defineRouteFor(`${mock_path}/nextstep`)
                .post({ execute(data: any) { return data.log } })
                .get({ execute() { } })
            expect(router.routes_dictionary.test).toBeDefined()
            expect(router.routes_dictionary.test.feature).toBeDefined()
            expect(router.routes_dictionary.test.feature.nextstep).toBeDefined()
            expect(router.routes_dictionary.test.feature.route instanceof Route).toBe(true)
            expect(router.routes_dictionary.test.feature.nextstep.route instanceof Route).toBe(true)
            expect(await router.deligateHandle(mock_path, METHODS.GET)).toBeDefined()
            expect(await router.deligateHandle(mock_path, METHODS.GET)).toBe(1)
            expect(await router.deligateHandle(`${mock_path}/nextstep`, METHODS.POST, { log: 'log' })).toBe('log')
            try {
                await router.deligateHandle(mock_path, METHODS.POST)
            }
            catch (e: any) {
                expect(e instanceof Error).toBeTruthy()
                expect(e.message).toBe(`Путь ${mock_path} с методом ${METHODS.POST} не существует`)
            }
            try {
                await router.deligateHandle('/status', METHODS.POST)
            }
            catch (e: any) {
                expect(e instanceof Error).toBeTruthy()
                expect(e.message).toBe(`Путь /status с методом ${METHODS.POST} не существует`)
            }
        })
    })
})