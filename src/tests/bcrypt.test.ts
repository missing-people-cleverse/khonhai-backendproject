import { compareHash, hashPassword } from "../auth/bcrypt"

describe('test bcrypt', () => {
    test('compareHash', () => {
        const hashTests: [string[],boolean][] = [
            [['123',hashPassword('123')], true],
            [['abc', hashPassword('abc')], true],
            [['abc', hashPassword('123')], false],
            [['567', hashPassword('abc')], false]
        ];

        hashTests.forEach((test) => {
            const [input, expected] = test;
            expect(compareHash(input[0],input[1])).toEqual(expected)
        }) 
    })
})



