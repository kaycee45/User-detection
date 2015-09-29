
function getAngle(x, y){
	var getAtan = Math.atan2(x, y);
	var ang = ~~(-getAtan/(Math.PI/180) + 180);
	return ang;
}

$(function() {  
	var radar_size = null, posx = null, posy = null;
	//based on the device its being viewed on, set the rader width or height to be the same as the screen width, then center its position
	if(screen.width > screen.height){
		 radar_size = screen.height - 100; //width and height same value
	}
	else{
		radar_size = screen.width - 100;
	}
	posLeft = (screen.width - radar_size) / 2;
	posTop = 10; //(screen.height - radar_size) / 2;
	
	var beam = $('#beam'),
        radar = $('#radar'),
		rings = $('.rings'),
        deg = 0,
        radius = radar_size / 2,
		circumference =  2 * Math.PI * radius;
		
	//radar.css({height: radar_size+"px", width: radar_size+"px", top: posTop+"px", left: posLeft+"px"});
	radar.css({height: radar_size+"px", width: radar_size+"px"});
	rings.css({height: radar_size-5+"px", width: radar_size-5+"px"});
	beam.css({height: radar_size-3+"px", width: radar_size-3+"px"});
	
	
	$(".panels").css({width: radius+"px", height: radius+"px"});
	$("#panel1").css({left: 0, top: 0, borderRight: "solid 3px #004000", borderBottom: "solid 3px #004000"});
	$("#panel2").css({left: radius+"px", top: 0, borderLeft: "solid 3px #004000", borderBottom: "solid 3px #004000"});
	$("#panel3").css({left: 0, top: radius+"px", borderRight: "solid 3px #004000", borderTop: "solid 3px #004000"});
	$("#panel4").css({left: radius+"px", top: radius+"px", borderLeft: "solid 3px #004000", borderTop: "solid 3px #004000"});
   
   //main focal point which is the center of the radar
   var lat = 51.513742;
   var lon = -0.08862;
   //http://www.doogal.co.uk/LatLong.php
   
   //other points
   var coords = [[51.513718, -0.088481],
            [51.513718, -0.088567],
            [51.513732, -0.088631],
            [51.513812, -0.088738],
            [51.513745, -0.088738],
            [51.514052, -0.088953],
            [51.514106, -0.088803],
            [51.514052, -0.089124],
            [51.514079, -0.088953],
            [51.514186, -0.088803],
            [51.514159, -0.088845],
			[51.514146, -0.088695],
			[51.514252, -0.08876],
			[51.514319, -0.088845],
			[51.514319, -0.088931],
			[51.514319, -0.089017],
			[51.514279, -0.08906],
			[51.514226, -0.089039],
			[51.514172, -0.089082],
            [51.514346, -0.08921]];
        
    var dist = new Distance();
    dist.calculate(lat,lon,coords);
	
	for(var grp=0; grp<dist.values.length; grp++){
		
		if(dist.values[grp].length < 1) continue;
		
		for(var ix=0; ix<dist.values[grp].length; ix++){
			var a = dist.values[grp][ix][0],
				d = dist.values[grp][ix][1],
				x = dist.values[grp][ix][2],
				y = dist.values[grp][ix][3];
			
			var getDeg = "";
			var obj = $("<div title='"+a+"deg, "+x+", "+y+"'></div>").css({
										background: 'url(user.png) no-repeat center',
										width: '30px',
										height: '30px', 
										position: 'absolute',
										padding: '3px',
										boxShadow: '0 0 10px 5px rgba(100,255,0,0.5)',
										borderRadius: '50%',
										outline: '0',
										zIndex: 555,
										opacity: '0.2'
									});						
			if(grp == 0){
				ax =  (radius - x) - radius;
				ay =  (radius - y) - radius;
				getDeg = getAngle(ax, ay);
				obj.css({bottom: y, right: x}).attr('data-atDeg', getDeg);
				$("#panel1").append(obj);
			}
			else if(grp == 1){
				ax =  (radius + x) - radius;
				ay =  (radius - y) - radius;
				getDeg = getAngle(ax, ay);
				obj.css({bottom: y, left: x}).attr('data-atDeg', getDeg);
				$("#panel2").append(obj);
			}
			else if(grp == 2){
				ax =  (radius - x) - radius;
				ay =  (radius + y) - radius;
				getDeg = getAngle(ax, ay);
				obj.css({top: y, right: x}).attr('data-atDeg', getDeg);
				$("#panel3").append(obj);	
			}
			else if(grp == 3){
				ax =  (radius + x) - radius;
				ay =  (radius + y) - radius;
				getDeg = getAngle(ax, ay);
				obj.css({top: y, left: x}).attr('data-atDeg', getDeg);
				$("#panel4").append(obj);	
			}
		}  
	}
    (function rotate() {      
      beam.css({transform: 'rotate('+ deg +'deg)'});
      $('[data-atDeg='+deg+']').stop().fadeTo(0,1).fadeTo(1700,0.2);

        // LOOP
        setTimeout(function() {
            deg = ++deg%360;
            rotate();
        }, 25);
    })();
});