import { compareHash, hashPassword } from "../auth/bcrypt"


describe('test bcrypt', () => {
    test('compareHash', () => {
        const hash = hashPassword('123')
        expect(compareHash('123', hash)).toEqual(true)
    })
})







// import { compareHash, hashPassword } from "../auth/bcrypt"


// describe('test bcrypt', () => {
//     test('compareHash 123 and 123', () => {
//         const hash = hashPassword('123')
//         expect(compareHash('123',hash)).toBe(true)
//     })
// })