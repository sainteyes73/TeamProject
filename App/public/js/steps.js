var stepDiv = document.getElementById("steps");
var supplyDiv = document.getElementById("supplies");

var step_children;
var supply_children;

if(stepDiv != null){
    step_children = stepDiv.children.length;
}

if(supplyDiv != null){
    supply_children = supplyDiv.children.length;
}

function addStep(){
    //alert("in function");
    var steps = document.getElementById("steps");
    if(steps != null){
        
        
        var step = `<div class="form-group">
                                <p>Step ${step_children+1}</p>
                                <label class="label label-primary" for="stepTitle-${step_children+1}">Step Title</label>
                                <input class="form-control" type="text" name="stepTitle-${step_children+1}" id="stepTitle-${step_children+1}" value="">
                            </div>
                            <div class="form-group">
                                <label class="label label-primary" for="stepDescription-${step_children+1}">Step Description</label>
                                <input class="form-control" type="text" name="stepDescription-${step_children+1}" id="stepDescription-${step_children+1}" value="">
                            </div>`;
        var div = document.createElement('div');
        div.innerHTML = step;
        steps.appendChild(div);
        step_children ++;
    }
}


function addSupply(){
    //alert("in function");
    var supplies = document.getElementById("supplies");
    if(supplies != null){
        var supply = `<div class="form-group">
                                <label class="label label-primary" for="supplyTitle-${supply_children+1}">Supply Title</label>
                                <input class="form-control" type="text" name="supplyTitle-${supply_children+1}" id="supplyTitle-${supply_children+1}" value="">
                            </div>
                            <div class="form-group">
                                <label class="label label-primary" for="supplyDescription-${supply_children+1}">Supply Description</label>
                                <input class="form-control" type="text" name="supplyDescription-${supply_children+1}" id="supplyDescription-${supply_children+1}" value="">
                            </div>
                            <div class="form-group">
                                <label class="label label-primary" for="supplyQuantity-${supply_children+1}">Supply Quantity</label>
                                <input class="form-control" type="text" name="supplyQuantity-${supply_children+1}" id="supplyQuantity-${supply_children+1}" value="">
                            </div>`;
        var div = document.createElement('div');
        div.innerHTML = supply;
        supplies.appendChild(div);
        supply_children++;
    }
}