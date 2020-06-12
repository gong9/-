/**
 * 迭代器模式
 */
const todo = {
    a: [1, 2, 3],
    b: [4, 5, 6],
    [Symbol.iterator]: function() {
        const all = [...this.a, ...this.b];
        let index = 0;
        return {
            next: function() {
                return {
                    value: all[index],
                    done: index++ >= all.length
                }
            }
        }
    }
}
for (const item of todo) {
    console.log(item);

}

/**
 * 生成器
 */
const todo = {
    a: [1, 2, 3],
    b: [4, 5, 6],
    [Symbol.iterator]: function*() {
        const all = [...this.a, ...this.b];
        for (const item of all) {
            yield item
        }

    }
}
for (const item of todo) {
    console.log(item);

}