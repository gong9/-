/**
 * 矩形中的路径
 */


function hasPath(matrix, rows, cols, path) {
    let k;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (findNext(matrix, rows, cols, i, j, path, k = 0)) {
                return true;
            }

        }
        return false;
    }


    function findNext(matrix, rows, cols, x, y, path, k) {
        if (k === path.length) {
            return true;
        }
        if (x < 0 || y < 0 || x > rows || y > cols || matrix[x][y] == "已占") {
            return false;
        }
        if (path[k] != matrix[x][y]) {

            return false;
        }


        // 占用此坐标
        matrix[x][y] === "已占"
            // 开始向四面去找
        if (findNext(matrix, rows, cols, x - 1, y, path, k = k++)) {
            return true
        }
        if (findNext(matrix, rows, cols, x, y + 1, path, k = k++)) {
            return true
        }
        if (findNext(matrix, rows, cols, x + 1, y, path, k = k++)) {
            return true
        }
        if (findNext(matrix, rows, cols, x, y - 1, path, k = k++)) {
            return true
        }
        //无路可走
        return false

    }

}
console.log(hasPath([
    ['a', 'b', 'c'],
    ['d', 'e', 'f']
], 2, 3, 'ab'));
console.log('abc'.length);

let str = 'abc'
console.log([...str]);