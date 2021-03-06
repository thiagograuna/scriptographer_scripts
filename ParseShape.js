// Export script for illustrator, map image generates map/area layout for html
// Works in Illustrator cs5 with latest scriptographer plugin (http://scriptographer.org)

// First we define the dialog components
var components = {
    zoom: { type: 'string', label: 'zoom', value: "1.0" },
    step: { type: 'string', label: 'step', value: "2.0" }
};

// Now we bring up the dialog
var values = Dialog.prompt('Enter zoom value', components);

var zoom = values && values['zoom'] ? parseFloat(values['zoom']) : 1.0;
print("ZOOM "+zoom);

var step = values && values['step'] ? parseFloat(values['step']) : 2.0;
print("STEP " + step);

var doc = document;
var arb = doc.artboards[0];

function parsePath(item, center) {

    console.log("Item", item, item.hasChildren());
    var curves = "";

    if (item.hasChildren()) {
        for each (path in item.children){
            curves += parsePath(path, center);
        }
        return curves;
    } 
    
    //var pp = new Path();
    //pp.closed = item.closed;
    curves += "[";
    for each (curve in item.curves) {
        var l = curve.length;
        var s = Math.ceil(l/step);
        s =1.0/s;
        if (s > 0 && s < 1.0) {
            for (var t=0; t<1.0; t += s) {
                var pt = curve.getPoint(t);
                //pp.add(pt);
                curves += "{x:"+((pt.x-center.x)*zoom).toFixed(2)+",y:"+((pt.y-center.y)*zoom).toFixed(2)+"},";
            }
        }
        //console.log(segment.handleIn);
    }
    return curves.slice(0,-1)+"],";
}


var data = "var SHAPES = [";
for each (item in doc.selectedItems) {
    data += "{name:\""+item.name+"\",curves:";
    data += "["+parsePath(item, item.bounds.center).slice(0,-1)+"]";
    data += "},";
}
data  = data.slice(0,-1)+"];";


var file = new File(script.file.parent, "shapes.js");
if (file.exists()) file.remove();
file.open();

file.write(data); file.close();