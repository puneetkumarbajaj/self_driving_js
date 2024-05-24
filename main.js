const carCanvas = document.getElementById('carCanvas');
carCanvas.width = 200;

const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.width = 300;

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');
const road = new Road(carCanvas.width/2, carCanvas.width*0.9);
//const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI", 4)
const N = 100;
const cars = generateCars(N);
let bestCar = cars[0];
if(localStorage.getItem('bestCar')){
    for(let i=0; i<cars.length; i++){
        cars[i].brain = JSON.parse(localStorage.getItem('bestCar'));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain);
        }
    }
}

const traffic=[
    new Car(road.getLaneCenter(1), -50, 30, 50, "DUMMY", 3),
    new Car(road.getLaneCenter(0), -200, 30, 50, "DUMMY", 3),
    new Car(road.getLaneCenter(2), -200, 30, 50, "DUMMY", 3),
]

animate();

function save(){
    localStorage.setItem('bestCar', JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem('bestCar');

}

function generateCars(N){
    const cars = [];
    for (let i = 0; i < N; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI", 4));
    }
    return cars;
}


function animate(){
    for(let i=0; i<traffic.length; i++){
        traffic[i].update(road.borders, []);
    }
    for(let i=0; i<cars.length; i++){
        cars[i].update(road.borders, traffic);
    }
    bestCar = cars.find(c=>c.y==Math.min (...cars.map(c=>c.y)));
    //car.update(road.borders, traffic);
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;
    carCtx.save();
    carCtx.translate(0, -bestCar.y+carCanvas.height*0.7);
    road.draw(carCtx);
    for(let i=0; i<traffic.length; i++){
        traffic[i].draw(carCtx, "cyan");
    }
    carCtx.globalAlpha = 0.2;
    for(let i=0; i<cars.length; i++){
        cars[i].draw(carCtx, "green");
    }
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, "blue", true);
    //car.draw(carCtx, "green");
    carCtx.restore();
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate);
}