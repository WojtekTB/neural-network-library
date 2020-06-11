/**
 * TODO: fix how the biases work, right now I just kinda chuck it up to the general computation,
 * hoping it works out, but in reality I should deal with them seperately by putting them into 
 * their own array and then adding them onto the result instead of doing whatever I am doing right now
 */


var SIGMOID_FUNCTION = function (n) {
    return 1 / (1 + Math.pow(2.71828, -n));
}

var UN_SUGMOID_FUNCTION = function (y) {
    return y * (1 - y)
}

var SIGN_FUNCTION = function (n) {
    return Math.sign(n);
}

var UN_SIGN_FUNCTION = function (n) {
    return 0;
}

class NeuralNetwork {
    constructor(numberOfInputs) {
        this.numberOfInputs = numberOfInputs;
        this.hiddenFunction = SIGMOID_FUNCTION;
        this.hiddenFunctionD = UN_SUGMOID_FUNCTION;
        this.learningRate = 0.01;
        this.layers = [];
        this.biases = [];

        /**
         * How layers store weights:
         * 
         * [
         *  [],
         *  []
         * ]
         */



    }

    setLearningRate(lr) {
        //by deafult 0.01
        this.learningRate = lr;
    }

    static copy(nn) {
        let newNN = new NeuralNetwork(nn.numberOfInputs);
        for (let i = 0; i < nn.layers.length; i++) {
            newNN.layers.push(Matrix.copy(nn.layers[i]));
        }
        return newNN;
    }

    static cross(a, b) {
        //this is probably not useful because I don't think crossing two neural nets will actually yield one with qualities similar to its parents
        let newNN = new NeuralNetwork(a.numberOfInputs);
        for (let i = 0; i < a.layers.length; i++) {
            newNN.layers.push(Matrix.cross(a.layers[i], b.layers[i]));
        }
        return newNN;
    }

    mutate(mutationRate) {
        //this is odd to be honest because I assyme that normally you wouldn't want to just randomly change weights in the neural net?
        for (let i = 0; i < this.layers.length; i++) {
            for (let j = 0; j < this.layers[i].rows; j++) {
                for (let k = 0; k < this.layers[i].columns; k++) {
                    if (Math.random() < mutationRate) {
                        this.layers[i].data[j][k] = (Math.random() * 2) - 1;
                    }
                }
            }
        }
    }

    feedForward(input, returnLayerOutputs) {
        //convert input array to a matrix object
        let input_matrix = Matrix.fromArray(input);

        let layerOutputs = [];

        for (let i = 0; i < this.layers.length; i++) {
            //multiply input by weights
            input_matrix = Matrix.multiply(input_matrix, this.layers[i]);
            //add a bias
            input_matrix = Matrix.add(input_matrix, this.biases[i]);
            //apply a function to the outputs
            input_matrix = Matrix.applyToAll(input_matrix, this.hiddenFunction);
            //save each output to be output later
            layerOutputs.push(Matrix.copy(input_matrix));
        }
        //convert back to array to output
        let input_array = Matrix.toArray(input_matrix);
        if (returnLayerOutputs === true) {
            return { output: input_array, layerOutputs: layerOutputs }
        } else {
            return input_array;
        }
    }

    trainBP(input, labels) {
        let ffOutput = this.feedForward(input, true);
        let yHat = ffOutput.output;
        let layerOutputs = ffOutput.layerOutputs;
        //convert arrays to matrix objects
        yHat = Matrix.fromArray(yHat);
        labels = Matrix.fromArray(labels);
        //calculate error (using difference squared as cost function)
        let error = Matrix.subtract(yHat, labels);
        error = Matrix.applyToAll(error, function (n) { return Math.pow(n, 2) });
        //add up all the errors
        error = Matrix.sum(error);
    }

    reward() {
        //this function is meant to make an error gradient and then increase those connections that are good, and those that are not so much

    }

    addLayer(numberNodes) {
        if (this.layers.length === 0) {
            let l = new Matrix(this.numberOfInputs, numberNodes);
            l.randomize();
            this.layers.push(l);

        } else {
            let m = new Matrix(this.layers[this.layers.length - 1].rows, numberNodes);
            m.randomize();
            this.layers.push(m);
        }
        let b = new Matrix(1, numberNodes);
        b.randomize();
        this.biases.push(b);
    }

    setOutputFunction(f) {
        this.outputFunction = f;
    }

    setHiddenFunction(f) {
        this.hiddenFunction = f;
    }
}

class Matrix {
    constructor(rows, columns) {
        this.rows = rows;
        this.columns = columns;
        this.data = [];

        //init data
        for (let i = 0; i < rows; i++) {
            let newRow = [];
            for (let j = 0; j < columns; j++) {
                newRow.push(0);
            }
            this.data.push(newRow);
        }
    }

    print() {
        console.table(this.data);
    }

    set(data, r, c) {
        this.data[r][c] = data;
    }

    randomize() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                this.set((Math.random() * 2) - 1, i, j);
            }
        }
    }

    static sum(m) {
        let totalSum = 0;
        for (let i = 0; i < m.rows; i++) {
            for (let j = 0; j < m.columns; j++) {
                totalSum += m.data[i][j];
            }
        }
        return totalSum;
    }

    static cross(a, b) {
        //this is a really shitty implementation of this but I am too lazy to figure out how to do it cleanly right now
        let mA;
        let mB;
        let r = Math.random();
        if (r > 0) {
            mA = a;
            mB = b;
        } else {
            mA = b;
            mB = a;
        }

        let arrayA = Matrix.matrixToOneDArray(mA)
        let arrayB = Matrix.matrixToOneDArray(mB)
        let n = [];
        let start = 0;
        let len = Math.floor((arrayA.length / 3) * Math.random());
        let chosenArray = arrayA;
        while (true) {
            if (start + len > arrayA.length) {
                len = arrayA.length - start;
                n = n.concat(chosenArray.slice(start, start + len + 1));
                break;
            }
            n = n.concat(chosenArray.slice(start, start + len + 1));

            if (chosenArray === arrayA) {
                chosenArray = arrayB;
            } else {
                chosenArray = arrayA;
            }

            start += len;
            len = Math.floor((arrayA.length / 2) * Math.random());

        }
        let output = Matrix.toMatrix(a.rows, a.columns, n);

        return output;
    }

    static toMatrix(r, c, data) {
        let n = new Matrix(r, c);
        for (let i = 0; i < n.rows; i++) {
            for (let j = 0; j < n.columns; j++) {
                n.data[i][j] = data[(i * c) + j];
            }
        }
        return n;
    }

    static matrixToOneDArray(m) {
        let a = [];
        for (let i = 0; i < m.rows; i++) {
            for (let j = 0; j < m.columns; j++) {
                a.push(m.data[i][j]);
            }
        }
        return a;
    }

    static copy(m) {
        let n = new Matrix(m.rows, m.columns);
        for (let i = 0; i < n.rows; i++) {
            n.data[i] = m.data[i].slice();
        }
        return n;
    }

    static applyToAll(m, f) {
        let n = new Matrix(m.rows, m.columns);
        for (let i = 0; i < n.rows; i++) {
            for (let j = 0; j < n.columns; j++) {
                n.data[i][j] = f(m.data[i][j]);
            }
        }
        return n;
    }

    static fromArray(a) {
        let n = new Matrix(1, a.length);
        for (let i = 0; i < a.length; i++) {
            n.set(a[i], 0, i);
        }
        return n;
    }

    static toArray(m) {
        let a = [];
        for (let i = 0; i < m.columns; i++) {
            a.push(m.data[0][i]);
        }
        return a;
    }

    static transpose(m) {
        let n = new Matrix(m.columns, m.rows);
        for (let i = 0; i < n.rows; i++) {
            for (let j = 0; j < n.columns; j++) {
                n.data[i][j] = m.data[j][i];
            }
        }
        return n;
    }

    static multiply(a, b) {
        let matrixA = a;
        let matrixB = b;
        if (matrixA.columns !== matrixB.rows) {//check if you can do dot product
            console.error("Matrices are not the right size!");
            return;
        }
        let n = new Matrix(a.rows, b.columns);

        for (let i = 0; i < n.rows; i++) {
            for (let j = 0; j < n.columns; j++) {
                let newVal = 0;
                for (let k = 0; k < a.columns; k++) {
                    newVal += matrixA.data[i][k] * matrixB.data[k][j];
                }
                n.set(newVal, i, j);
            }
        }
        return n;
    }

    static multiplyScalar(m, s) {
        let matrixA = m;
        let n = new Matrix(m.rows, m.columns);

        for (let i = 0; i < m.rows; i++) {
            for (let j = 0; j < m.columns; j++) {
                n.data[i][j] = matrixA.data[i][j] * s;
            }
        }
        return n;

    }

    static elementMult(a, b) {
        let matrixA = a;
        let matrixB = b;
        let n = new Matrix(a.rows, a.columns);

        for (let i = 0; i < a.rows; i++) {
            for (let j = 0; j < a.columns; j++) {
                n.data[i][j] = matrixA.data[i][j] * matrixB.data[i][j];
            }
        }
        return n;
    }

    static add(a, b) {
        let matrixA = a;
        let matrixB = b;
        let n = new Matrix(a.rows, a.columns);

        for (let i = 0; i < a.rows; i++) {
            for (let j = 0; j < a.columns; j++) {
                n.data[i][j] = matrixA.data[i][j] + matrixB.data[i][j];
            }
        }
        return n;
    }
    static subtract(a, b) {
        let matrixA = a;
        let matrixB = b;
        let n = new Matrix(a.rows, a.columns);

        for (let i = 0; i < a.rows; i++) {
            for (let j = 0; j < a.columns; j++) {
                n.data[i][j] = matrixA.data[i][j] - matrixB.data[i][j];
            }
        }
        return n;
    }
}