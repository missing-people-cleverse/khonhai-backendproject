import { addToBlacklist, isBlacklist } from "../repositories/blacklist"



describe("test blacklist", () => {
    test("add and compare blacklist", () => {
        const blacklistTest = [
            [['12345678', addToBlacklist('12345678')], true],
            //[['876543221', addToBlacklist('12345678')], false],
        ]

        blacklistTest.forEach((test) => {
            const [ input, expected ] = test
            expect(isBlacklist(input[0])).toEqual(expected)
        })
    })
})




// async addToBlacklist(token: string): Promise<void> {
//     await this.db.sAdd(keyBlacklist, token);
//   }

//   async isBlacklist(token: string): Promise<boolean> {
//     return this.db.sIsMember(keyBlacklist, token);
//   }


// describe('test bcrypt', () => {
//     test('compareHash', () => {
//         const hashTests: [string[],boolean][] = [
//             [['123',hashPassword('123')], true],
//             [['abc', hashPassword('abc')], true],
//             [['abc', hashPassword('123')], false],
//             [['567', hashPassword('abc')], false]
//         ];

//         hashTests.forEach((test) => {
//             const [input, expected] = test;
//             expect(compareHash(input[0],input[1])).toEqual(expected)
//         }) 
//     })
// })

