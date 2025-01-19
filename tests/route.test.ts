const Route = require("../router/routes/route")

describe('Route - класс, содержащий методы для работы с определенным путем', () => {
    const mock_path = '/mock/test'
    const GET = 'GET'
    let route = new Route(mock_path)
    test('Route принимает путь и может его вернуть при необходимости', () => {
        expect(route.getPath()).toBe(mock_path)
    })
    describe('Route может определять методы запроса и их обработчики, а также вызывать их', () => {
        const mockHandler = jest.fn((path: string, method: string) => {
            console.log(`Я обработчик для ${method} метода пути ${path}`)
        })
        const mockHandlerObject = {
            data: {
                path: mock_path, method: GET
            },
            execute() {
                const { path, method } = mockHandlerObject.data
                return mockHandler(path, method)
            }
        }
        test('Route добавляет метод запроса и его обработчик', () => {
            route.apply(GET, mockHandlerObject, [])
            expect(route.handlers[GET]).toBeDefined()
            expect(Array.isArray(route.handlers[GET].mwrs)).toBe(true)
        })
        test('Route может вызвать обработчик', () => {
            route.resolve(GET)
            expect(mockHandler).toBeCalledTimes(1)
        })
    })
})