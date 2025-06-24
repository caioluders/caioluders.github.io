// twigl.app shader
// geekest (300 es)

function sdf_box(vec2 p, vec2 b) {
    vec2 d = abs(p)-b;
    return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}

float c=length(FC.xy/r-.5);