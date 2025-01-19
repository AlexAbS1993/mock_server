const Router = require("../router/router")

describe('Router принимает в себя роуты с обработчиками и выдаёт список роутов, проходя по списку зарегистрированных', () => {
    let router = new Router()
    describe('Router может сохранять в себе объекты роутов', () => {
        test('Роуты должны соответствовать требуемому интерфейсу', () => {
            expect(router).toBeDefined()
        })
    })
})