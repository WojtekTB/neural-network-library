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

    set(data, row, coulomb) {
        this.data[row][coulomb] = data;
    }

    fromArray(array) {
        let newMatrix = new Matrix(1, array.length);
        for (let i = 0; i < array.length; i++) {
            newMatrix.set(array[i], 0, i);
        }
        return newMatrix;
    }
    fromArrayVertical(array) {
        let newMatrix = new Matrix(array.length, 1);
        for (let i = 0; i < array.length; i++) {
            newMatrix.set(array[i], i, 0);
        }
        return newMatrix;
    }

    toArray() {
        let newArray = [];
        for (let i = 0; i < this.data[0].length; i++) {
            newArray.push(this.data[0][i]);
        }
        return newArray;
    }

    toArrayVertical() {
        let newArray = [];
        for (let i = 0; i < this.data.length; i++) {
            newArray.push(this.data[i][0]);
        }
        return newArray;
    }

    randomize() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.coulombs; j++) {
                this.data[i][j] = 1 - (Math.random() * 2);
            }
        }
    }

    add(input) {
        if (input instanceof Matrix) {
            //if you try to add another matrix to this matrix
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.coulombs; j++) {
                    this.data[i][j] = this.data[i][j] + input.data[i][j];
                }
            }

        } else {
            //if you try to add a scalar to this matrix
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.coulombs; j++) {
                    this.data[i][j] = this.data[i][j] + input;
                }
            }
        }

    }

    multiply(input) {
        if (input instanceof Matrix) {
            //if you try to multiply another matrix to this matrix
            if (this.rows !== input.rows || this.coulombs !== input.coulombs) {
                console.error("Matrices are not the same size!");
                return;
            }
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.coulombs; j++) {
                    this.data[i][j] = this.data[i][j] * input.data[i][j];
                }
            }
        } else {
            //if you try to multiply a scalar to this matrix
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.coulombs; j++) {
                    this.data[i][j] = this.data[i][j] * input;
                }
            }
        }
    }

    dot(input) {
        //assume dot product of A*B
        let matrixA = this;
        let matrixB = input;

        if (matrixA.coulombs !== matrixB.rows) {//check if you can do dot product
            console.error("Matrices are not the right size!");
            return;
        }

        let output = new Matrix(matrixA.rows, matrixB.coulombs);

        for (let i = 0; i < matrixA.rows; i++) {
            for (let j = 0; j < matrixB.coulombs; j++) {
                let sum = 0;
                for (let k = 0; k < matrixA.coulombs; k++) {
                    sum += matrixA.data[i][k] * matrixB.data[k][j];
                }
                output.data[i][j] = sum;
            }
        }
        return output;

    }

    cross(input) {
        console.error("haha, so funny situation, as it turns out I don't actually need this function for NN, at least in its early stage, so I am not gonna bother implementing it right now");
    }

    print() {
        console.table(this.data);
    }

    transmute() {
        let output = new Matrix(1, this.coulombs);
        output = output.fromArrayVertical(this.toArray());
        return output;
    }

    transmuteVertical() {
        let output = new Matrix(1, this.coulombs);
        output = output.fromArray(this.toArray());
        return output;
    }

    applyFunctionToAll(appliedFunction) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.coulombs; j++) {
                this.data[i][j] = appliedFunction(this.data[i][j]);
            }
        }
    }
}