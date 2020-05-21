var SIGMOID_FUNCTION = function (n) {
    return 1 / (1 + Math.pow(2.71828, -n));
}

var UN_SUGMOID_FUNCTION = function (y) {
    return y * (1 - y)
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
        // this.layers.push(new Layer(inputs + 1, nodes, activationFunction));
        this.layers.push(new Layer(inputs, nodes, activationFunction));

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
            // matrixInput = matrixInput.fromArray(inputs.concat([1]));
            matrixInput = matrixInput.fromArray(inputs);
            matrixInput = Matrix.transpose(matrixInput);
        }

        // matrixInput.print();

        let originalInputs = matrixInput.data.toString();

        for (let i = 0; i < this.layers.length; i++) {
            if (this.debug) {
                console.log(`Fed ${matrixInput.data.toString()} to a layer number ${i + 1}`);
            }
            matrixInput = this.layers[i].feedThrough(matrixInput);
            matrixInput.print();
            // let arrayForm = matrixInput.toArray();
            // // arrayForm = arrayForm.concat([1]);
            // arrayForm = arrayForm;
            // matrixInput = new Matrix(arrayForm.length, 1);
            // matrixInput = matrixInput.fromArray(arrayForm);
            if (this.debug) {
                console.log(`Layer number ${i + 1} returned ${matrixInput.data.toString()}`);
            }
        }
        let output = Matrix.transpose(matrixInput);
        let outputArray = output.toArray();
        if (this.debug) {
            console.log(`Neural network recieved ${originalInputs} and returned ${outputArray}`);
        }
        // return outputArrat.splice(0, outputArrat.length - 1);//remove bias result from the last one since we don't need it
        // return outputArrat.splice(0, outputArrat.length);//remove bias result from the last one since we don't need it
        return outputArray;
    }

    train(input, answer) {
        /**
         * Answers come out in a form of an array of floats
         * Both input and answer should be an array
         */
        let prediction = Matrix.fromArray(this.feedForward(input));

        let desiredOutput = Matrix.fromArray(answer);

        let output_error = Matrix.transpose(Matrix.subtract(prediction, desiredOutput));
        output_error.print();

        //figure out the proportion of how much error each weight is responsible for
        let layerErrors = []
        layerErrors.push(output_error);

        for (let i = this.layers.length - 1; i > 0; i--) {//go through all the layers backwards but not through the output layer
            let transposedWeightsOfLayer = Matrix.transpose(this.layers[i].weights);


            let a = transposedWeightsOfLayer;
            let b = layerErrors[layerErrors.length - 1];

            // console.log(a, b);

            // a.print();
            // b.print();

            let layer_error = Matrix.dot(a, b);

            layerErrors.push((layer_error));
            // console.log("------");
        }
        // console.log(layerErrors);

        //calculate error gradient

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
        this.weights = new Matrix(numberOfNodes, numberOfInputs);
        this.weights.randomize();
    }
    feedThrough(input) {
        // input.print();
        // this.weights.print();
        let output = Matrix.dot(this.weights, input);
        // output.print();
        // output = output.transmuteVertical();
        output.applyFunctionToAll(this.activationFunction);
        return output;
    }
}