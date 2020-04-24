/**
 * A general rule I want to keep in mind is that whenever I do any kind of math 
 * operation with Matrices I just output a new one instead of changing the current object
 */

class Matrix {
    constructor(rows, coulombs) {
        this.rows = rows;
        this.coulombs = coulombs;
        this.data = [];
        for (let i = 0; i < this.rows; i++) {
            let row = [];
            for (let j = 0; j < this.coulombs; j++) {
                row.push(0);
            }
            this.data.push(row);
        }
    }

    randomize() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.coulombs; j++) {
                this.data[i][j] = Math.random();
            }
        }
    }

    add(input) {
        if (input instanceof Matrix) {
            //if you try to add another matrix to this matrix
            let output = new Matrix(this.rows, this.coulombs);
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.coulombs; j++) {
                    output[i][j] = this.data[i][j] + input.data[i][j];
                }
            }
            return output;//output a matrix with new values

        } else {
            //if you try to add a scalar to this matrix
            let output = new Matrix(this.rows, this.coulombs);
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.coulombs; j++) {
                    output[i][j] = this.data[i][j] + input;
                }
            }
            return output;//output a matrix with new values
        }

    }

    print() {
        console.table(this.data);
    }
}