var SIGMOID_FUNCTION = function (n) {
    return 1 / (1 + Math.pow(2.71828, -n));
}

var SIGN_FUNCTION = function (n) {
    return Math.sign(n);
}

class NeuralNetwork {
    constructor(numberOfInputs) {
        this.numberOfInputs = numberOfInputs;
        this.layers = [];
        this.debug = false;
        this.learningRate = 0.1;
    }

    setLearningRate(lr) {
        this.learningRate = lr;
    }

    debugMode() {
        this.debug = true;
        console.log(`Entered debug mode.`);
    }

    printWeights() {
        for (let i = 0; i < this.layers.length; i++) {
            this.layers[i].weights.print();
        }
    }

    addLayer(numberOfNodes, activationFunction) {
        let inputs;
        let nodes = numberOfNodes;
        if (this.layers.length === 0) {
            inputs = this.numberOfInputs;
        } else {
            inputs = this.layers[this.layers.length - 1].numberOfNodes;
        }
        this.layers.push(new Layer(inputs + 1, nodes, activationFunction));

        if (this.debug) {
            console.log(`Added a layer with ${inputs} inputs and ${nodes} nodes.`);
        }
    }

    feedForward(inputs) {
        let matrixInput;
        if (inputs instanceof Matrix) {
            matrixInput = inputs;
            if (matrixInput.rows > 1) {//flip the array
                matrixInput = matrixInput.transmuteVertical();
            }
        } else {
            matrixInput = new Matrix(inputs.length, 1);
            matrixInput = matrixInput.fromArray(inputs.concat([1]));
        }

        let originalInputs = matrixInput.data.toString();

        for (let i = 0; i < this.layers.length; i++) {
            if (this.debug) {
                console.log(`Fed ${matrixInput.data.toString()} to a layer number ${i + 1}`);
            }
            matrixInput = this.layers[i].feedThrough(matrixInput);
            let arrayForm = matrixInput.toArray();
            arrayForm = arrayForm.concat([1]);
            matrixInput = new Matrix(1, arrayForm.length);
            matrixInput = matrixInput.fromArray(arrayForm);
            if (this.debug) {
                console.log(`Layer number ${i + 1} returned ${matrixInput.data.toString()}`);
            }
        }
        let output = matrixInput;
        if (this.debug) {
            console.log(`Neural network recieved ${originalInputs} and returned ${output.toArray()}`);
        }
        let outputArrat = output.toArray();
        return outputArrat.splice(0, outputArrat.length - 1);
    }

    train(input, answer) {
        /**
         * Answers come out in a form of an array of floats
         * Both input and answer should be an array
         */
        let prediction = this.feedForward(input);

        let deltaSquared = [];

        for (let i = 0; i < prediction.length; i++) {
            //find difference squared
            deltaSquared.push(Math.pow(answer[i] - prediction[i], 2));
        }
        console.log(deltaSquared);

        //figure out how much to change previous 
    }
}

/**
 * Every layer needs to have a matrix of weights
 * 
 */

class Layer {
    constructor(numberOfInputs, numberOfNodes, activationFunction) {
        this.numberOfInputs = numberOfInputs;
        this.numberOfNodes = numberOfNodes;
        this.activationFunction = activationFunction;
        this.weights = new Matrix(numberOfInputs, numberOfNodes);
        this.weights.randomize();
    }
    feedThrough(input) {
        let output = input.dot(this.weights);
        // output = output.transmuteVertical();
        output.applyFunctionToAll(this.activationFunction);
        return output;
    }
}