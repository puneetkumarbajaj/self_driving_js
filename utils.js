function lerp(a, b, t){
    return a + (b-a)*t;
}

function getIntersection(p1, p2, p3, p4){
    const tTop = (p4.x-p3.x)*(p1.y-p3.y) - (p4.y-p3.y)*(p1.x-p3.x);
    const uTop = (p3.y-p1.y)*(p1.x-p2.x) - (p3.x-p1.x)*(p1.y-p2.y);
    const bottom = (p4.y-p3.y)*(p2.x-p1.x) - (p4.x-p3.x)*(p2.y-p1.y);

    if(bottom!=0){
        const t = tTop/bottom;
        const u = uTop/bottom;
        if(t>=0 && t<=1 && u>=0 && u<=1){
            return {
                x: lerp(p1.x, p2.x, t),
                y: lerp(p1.y, p2.y, t),
                offset: t
            }
        }
    }
    return null;
}

function polyIntersect(poly1, poly2){
    for(let i=0; i<poly1.length; i++){
        const p1 = poly1[i];
        const p2 = poly1[(i+1)%poly1.length];
        for(let j=0; j<poly2.length; j++){
            const p3 = poly2[j];
            const p4 = poly2[(j+1)%poly2.length];
            if(getIntersection(p1, p2, p3, p4)){
                return true;
            }
        }
    }
    return false;
}