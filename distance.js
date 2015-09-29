var Distance = function(){
	
	//main point
	this.lat1 = null;
	this.lon1 = null;
	
	//second point
	this.lat2 = null;
	this.lon2 = null;
        
        this.ang = null;
        this.hyp = null;
        this.opp = null;
        this.adj = null;
        
        this.values = [];
		
        
		Distance.prototype.calculate = function(focus_lat,focus_lon,coords){
            this.lat1 = focus_lat;
            this.lon1 = focus_lon;
			var count = 0, grp1 = [], grp2 = [], grp3 = [], grp4 = [];
			
			for(var i=0; i<coords.length; i++){
				count++;
				this.lat2 = coords[i][0];
				this.lon2 = coords[i][1];
				
				this.bearing();
				this.hypotenus();
				this.opposite();
				this.adjacent();
				
				var val = [this.ang,this.hyp,this.adj,this.opp];
				if(count == 0) grp1.push(val);
				else if(count == 1) grp2.push(val);
				else if(count == 2) grp3.push(val);
				else if(count == 3) grp4.push(val);
				else count = 0;
			}
			this.values.push(grp1);
			this.values.push(grp2);
			this.values.push(grp3);
			this.values.push(grp4);
        };
        
        //bearing between 2 points
        Distance.prototype.bearing = function(){
            // θ = atan2( sin(LON2 - LON1) * cos LAT2 , cos LAT1 * sin LAT2 − sin LAT1 * cos LAT2 * cos(LON2 - LON1) )
            var y = Math.sin(this.lon2 - this.lon1) * Math.cos(this.lat2);
            var x = Math.cos(this.lat1) * Math.sin(this.lat2) - Math.sin(this.lat1) * Math.cos(this.lat2) * Math.cos(this.lon2 - this.lon1);
            var b = Math.atan2(y, x) * (180 / Math.PI);

            this.ang =  Math.ceil((b + 180) % 180);
        };
	
        //Hypotenus distance between 2 geo points using Haversine Formular
        Distance.prototype.hypotenus = function(){
           /* 
                * Haversine formular
                * a = sin²((LAT2 - LAT1)/2) + cos LAT1 * cos LAT2 * sin²((LON2 - LON1)/2) //square of half the chord lenth between the points
                * c = 2 * atan2( √a, √(1−a) ) //angular distance in radians
                * d = R * c
                * where 	LAT is latitude, LON is longitude, R is earth’s radius (mean radius = 6,371km);
                * note that the LAT and LON need to be in radians to pass to trig functions
           */
            //Convert to radiance
            var rad_lat1 = this.lat1 * Math.PI / 180; // deg2rad below
            var rad_lat2 = this.lat2 * Math.PI / 180;

            var xlat = (this.lat2 - this.lat1) * Math.PI / 180;
            var xlon = (this.lon2 - this.lon1) * Math.PI / 180;
            var r = 6371000; //is earth’s radius in meters

            //get sin² for lat and lon
            var lat_sin_sq = Math.sin(xlat/2) * Math.sin(xlat/2);
            var lon_sin_sq = Math.sin(xlon/2) * Math.sin(xlon/2);

            var a = lat_sin_sq + Math.cos(rad_lat1) * Math.cos(rad_lat2) * lon_sin_sq;
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            var d = Math.ceil(r * c);

            this.hyp = d; //divide by 1000 to convert to kilometers
        };
        
        //point X - find the opposite side of the triangle using the hypotenus and bearing
        Distance.prototype.opposite = function(){
            /*
            * Find the opposit using cross multiplication in the sinθ formular
            * sin(θ) = opposit/hypotenus
            */
			var o =  Math.ceil(Math.sin(this.ang) * this.hyp);
			this.opp = o;
        };
        
        //point Y - find the adjacent side of the triangle using the hypotenus and the opposite
        Distance.prototype.adjacent = function(){
            /*
            * Find the adjacent side using Pythagoras Theorem 
            * hyp² = opp² + adj²
            * hyp² - opp² = adj² //switch the both sides using simultaneos equation plus plus minus
            */
           var a = Math.ceil(Math.sqrt((this.hyp * this.hyp) - (this.opp * this.opp)));
		   this.adj = a;
        };
};